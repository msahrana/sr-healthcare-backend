import { addMinutes, isBefore, isSameDay, subHours } from 'date-fns';
import httpStatus from 'http-status';
import PDFDocument from 'pdfkit';
import {
    AppointmentStatus,
    PaymentStatus,
    Role,
    ScheduleStatus,
} from '../../../generated/prisma/enums';

import config from '../../config';
import { IQuery } from '../../interfaces';

import { transporter } from '../../lib/nodemailer';
import { prisma } from '../../lib/prisma';
import type { RequestUser } from '../../middleware/checkAuth';
import { AppError } from '../../utils/AppError';
import {
    IBkashCallbackQuery,
    IBookAppointmentPayload,
    ICancelAppointmentPayload,
    IPayAppointmentPayload,
    IUpdateAppointmentStatusPayload,
} from './appointment.interface';
import { getBKashIdToken } from '../../lib/bkash';
import { AppointmentWhereInput } from '../../../generated/prisma/models';

const bookAppointment = async (
    payload: IBookAppointmentPayload,
    user: RequestUser,
) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        // business logic

        const patient = await prisma.patient.findUnique({
            where: { userId: user.id },
        });

        if (!patient) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Patient Profile Not Found',
            );
        }

        const schedule = await prisma.schedule.findUnique({
            where: { id: payload.scheduleId },
            include: { doctor: true },
        });

        if (!schedule || schedule.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'Schedule Not Found');
        }

        if (schedule.status !== ScheduleStatus.PUBLISHED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'This Schedule Is Not Published Yet',
            );
        }

        const now = new Date();

        if (!isSameDay(now, schedule.startDateTime)) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'This Schedule Is Not Available Today',
            );
        }

        if (!isBefore(now, schedule.startDateTime)) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'This Schedule Has Already Started',
            );
        }
        // if(isAfter(now, schedule.startDateTime)){
        // 	throw new AppError(
        // 		httpStatus.BAD_REQUEST,
        // 		"This Schedule Has Already Started",
        // 	);
        // }

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                patientId: patient.id,
                scheduleId: schedule.id,
                // status : { not : AppointmentStatus.CANCELLED }
            },
        });

        if (existingAppointment?.status === AppointmentStatus.PENDING) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'You Already Have A Pending Appointment. Please Pay For That',
            );
        }
        if (existingAppointment?.status === AppointmentStatus.CONFIRMED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'You Already Have A Confirmed Appointment.',
            );
        }
        if (existingAppointment?.status === AppointmentStatus.ONGOING) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'You Already Have A Ongoing Appointment',
            );
        }
        if (existingAppointment?.status === AppointmentStatus.COMPLETED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'You Already Have Completed An Appointment On This Schedule. Please Try Again Another Day',
            );
        }

        if (schedule.availableSlots === 0) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'This Schedule Is Fully Booked',
            );
        }

        if (!schedule.doctor.consultationFee) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Doctor Has Not Set A Consultation Fee Yet',
            );
        }

        const amount = schedule.doctor.consultationFee.toString();

        const appointment = await tx.appointment.create({
            data: {
                status: AppointmentStatus.PENDING,
                patientId: patient.id,
                doctorId: schedule.doctor.id,
                scheduleId: schedule.id,
            },
        });

        const bkashIdToken = await getBKashIdToken();

        if (!bkashIdToken) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                'No Bkash Access Token Found!',
            );
        }

        const bkashCreatePaymentResponse = await fetch(
            `${config.bkash_base_url}/tokenized/checkout/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: bkashIdToken,
                    'X-App-Key': config.bkash_app_key,
                },
                body: JSON.stringify({
                    mode: '0011',
                    // payerReference: "0123456789", //user email or phone number
                    payerReference: user.email, //user email or phone number
                    callbackURL: `${config.bkash_callback_url}/appointment/book-appointment/payment/callback`,
                    amount: amount,
                    currency: 'BDT',
                    intent: 'sale',
                    // merchantInvoiceNumber: "Inv4" // apppointment id
                    merchantInvoiceNumber: appointment.id, // apppointment id
                }),
            },
        );

        const bkashCreatePaymentResult =
            await bkashCreatePaymentResponse.json();

        //paymen model create

        await tx.payment.create({
            data: {
                status: PaymentStatus.UNPAID,
                merchantInvoiceNumber:
                    bkashCreatePaymentResult.merchantInvoiceNumber,
                appointmentId: appointment.id,
                amount,
                gatewayResponse: bkashCreatePaymentResult,
                bkashPaymentId: bkashCreatePaymentResult.paymentID,
                payerReference: user.email,
            },
        });

        return {
            paymentUrl: bkashCreatePaymentResult.bkashURL,
        };
    });

    return transactionResult;
};

const payAppointment = async (
    payload: IPayAppointmentPayload,
    user: RequestUser,
) => {
    const appointmentId = payload.appointmentId;

    const existingAppointment = await prisma.appointment.findUnique({
        where: {
            id: appointmentId,
        },
        include: {
            schedule: {
                include: {
                    doctor: true,
                },
            },
        },
    });

    if (!existingAppointment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Appointment Does Not Exists');
    }

    if (existingAppointment.status !== 'PENDING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Appointment Is Not Pending!',
        );
    }

    // if (existingAppointment.status === "CANCELLED" || existingAppointment.status === "ONGOING" || existingAppointment.status === "COMPLETED"){
    //     const appointmentStatus = existingAppointment.status
    //     throw new Error(`Appointment is already ${appointmentStatus.toLowerCase}`)
    // }

    if (!existingAppointment.schedule.doctor.consultationFee) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Doctor Has Not Set A Consultation Fee Yet',
        );
    }

    const amount =
        existingAppointment.schedule.doctor.consultationFee.toString();
    const bkashIdToken = await getBKashIdToken();

    if (!bkashIdToken) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            'No Bkash Access Token Found!',
        );
    }

    const bkashCreatePaymentResponse = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/create`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: bkashIdToken,
                'X-App-Key': config.bkash_app_key,
            },
            body: JSON.stringify({
                mode: '0011',
                // payerReference: "0123456789", //user email or phone number
                payerReference: user.email, //user email or phone number
                callbackURL: `${config.bkash_callback_url}/appointment/book-appointment/payment/callback`,
                amount: amount,
                currency: 'BDT',
                intent: 'sale',
                // merchantInvoiceNumber: "Inv4" // apppointment id
                merchantInvoiceNumber: existingAppointment.id, // apppointment id
            }),
        },
    );

    const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

    await prisma.payment.update({
        where: {
            appointmentId: existingAppointment.id,
        },

        data: {
            merchantInvoiceNumber:
                bkashCreatePaymentResult.merchantInvoiceNumber,
            gatewayResponse: bkashCreatePaymentResult,
            bkashPaymentId: bkashCreatePaymentResult.paymentID,
        },
    });

    return {
        paymentUrl: bkashCreatePaymentResult.bkashURL,
    };
};

const bookAppointmentCallback = async (query: IBkashCallbackQuery) => {
    const paymentId = query.paymentID;
    const callbackStatus = query.status;

    if (!paymentId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Payment ID Missing');
    }

    if (!callbackStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Payment Status Missing');
    }

    // 1. Find existing payment
    const existingPayment = await prisma.payment.findUnique({
        where: {
            bkashPaymentId: paymentId,
        },
    });

    if (!existingPayment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found');
    }

    // 2. Prevent duplicate callback
    if (existingPayment.status === PaymentStatus.PAID) {
        return {
            redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=success`,
        };
    }

    if (existingPayment.status !== PaymentStatus.UNPAID) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'This Payment Is No Longer Pending',
        );
    }

    // 3. Handle cancel and failure
    if (callbackStatus === 'cancel' || callbackStatus === 'failure') {
        const paymentStatus =
            callbackStatus === 'cancel'
                ? PaymentStatus.CANCELLED
                : PaymentStatus.FAILED;

        await prisma.payment.updateMany({
            where: {
                id: existingPayment.id,
                status: PaymentStatus.UNPAID,
            },
            data: {
                status: paymentStatus,
            },
        });

        return {
            redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=${callbackStatus}`,
        };
    }

    if (callbackStatus !== 'success') {
        return {
            redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=pending`,
        };
    }

    // 4. Get bKash token
    const bkashIdToken = await getBKashIdToken();

    if (!bkashIdToken) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            'No bKash Access Token Found!',
        );
    }

    // 5. Execute bKash payment
    const executeResponse = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/execute`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: bkashIdToken,
                'X-App-Key': config.bkash_app_key,
            },
            body: JSON.stringify({
                paymentID: paymentId,
            }),
        },
    );

    const executedPaymentResult = await executeResponse.json();

    console.log('========== BKASH EXECUTE RESPONSE ==========');
    console.log(JSON.stringify(executedPaymentResult, null, 2));
    console.log('Transaction ID:', executedPaymentResult.trxID);
    console.log('Transaction Status:', executedPaymentResult.transactionStatus);
    console.log(
        'Payment Execute Time:',
        executedPaymentResult.paymentExecuteTime,
    );
    console.log('============================================');

    // 6. Verify actual payment result
    if (
        !executeResponse.ok ||
        executedPaymentResult.transactionStatus !== 'Completed' ||
        !executedPaymentResult.trxID
    ) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            executedPaymentResult.statusMessage ||
                'bKash Payment Verification Failed',
        );
    }

    if (
        executedPaymentResult.merchantInvoiceNumber !==
        existingPayment.appointmentId
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Payment Invoice Does Not Match Appointment',
        );
    }

    if (
        Number(executedPaymentResult.amount) !== Number(existingPayment.amount)
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Payment Amount Does Not Match',
        );
    }

    // 7. Update everything in one transaction
    const result = await prisma.$transaction(
        async (tx) => {
            // Atomically claim this pending payment.
            // Only one callback can successfully change PENDING to PAID.
            const paymentClaim = await tx.payment.updateMany({
                where: {
                    id: existingPayment.id,
                    status: PaymentStatus.UNPAID,
                },
                data: {
                    status: PaymentStatus.PAID,
                    bkashPaymentId: paymentId,
                    bkashTrxId: executedPaymentResult.trxID,
                    paidAt: new Date().toISOString(),
                    gatewayResponse: executedPaymentResult,
                },
            });

            if (paymentClaim.count === 0) {
                const currentPayment = await tx.payment.findUnique({
                    where: {
                        id: existingPayment.id,
                    },
                });

                if (currentPayment?.status === PaymentStatus.PAID) {
                    return {
                        alreadyPaid: true as const,
                        appointmentId: existingPayment.appointmentId,
                    };
                }

                throw new AppError(
                    httpStatus.CONFLICT,
                    'Payment Could Not Be Confirmed',
                );
            }

            // Find appointment
            const appointment = await tx.appointment.findUnique({
                where: {
                    id: existingPayment.appointmentId,
                },
                include: {
                    schedule: true,
                    patient: true,
                    doctor: true,
                },
            });

            if (!appointment) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'Appointment Not Found',
                );
            }

            if (!appointment.patient || !appointment.doctor) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'Patient or Doctor Information Not Found',
                );
            }

            if (appointment.status !== AppointmentStatus.PENDING) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Appointment Is Not Pending',
                );
            }

            // Atomically reserve one available slot
            const slotUpdate = await tx.schedule.updateMany({
                where: {
                    id: appointment.scheduleId,
                    availableSlots: {
                        gt: 0,
                    },
                },
                data: {
                    availableSlots: {
                        decrement: 1,
                    },
                },
            });

            if (slotUpdate.count === 0) {
                throw new AppError(
                    httpStatus.CONFLICT,
                    'No Available Appointment Slots',
                );
            }

            // Get updated schedule
            const updatedSchedule = await tx.schedule.findUniqueOrThrow({
                where: {
                    id: appointment.scheduleId,
                },
            });

            // Generate serial number
            const serialNumber =
                updatedSchedule.totalSlots - updatedSchedule.availableSlots;

            // Generate joining time
            const joiningTime = addMinutes(
                updatedSchedule.startDateTime,
                (serialNumber - 1) * 20,
            );

            // Update appointment
            const updatedAppointment = await tx.appointment.update({
                where: {
                    id: appointment.id,
                },
                data: {
                    status: AppointmentStatus.CONFIRMED,
                    serialNumber,
                    joiningTime,
                },
            });

            // Get updated payment
            const updatedPayment = await tx.payment.findUniqueOrThrow({
                where: {
                    id: existingPayment.id,
                },
            });

            return {
                alreadyPaid: false as const,
                appointment: updatedAppointment,
                payment: updatedPayment,
                patient: appointment.patient,
                doctor: appointment.doctor,
                schedule: updatedSchedule,
            };
        },
        {
            maxWait: 10000,
            timeout: 30000,
        },
    );

    // 8. Stop if payment was already completed
    if (result.alreadyPaid) {
        return {
            redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=success`,
        };
    }

    // 9. Generate PDF invoice
    const pdfDocument = new PDFDocument({
        margin: 50,
    });

    const pdfChunks: Buffer[] = [];

    const pdfReadyPromise = new Promise<Buffer>((resolve, reject) => {
        pdfDocument.on('data', (chunk: Buffer) => {
            pdfChunks.push(chunk);
        });

        pdfDocument.on('end', () => {
            resolve(Buffer.concat(pdfChunks));
        });

        pdfDocument.on('error', reject);
    });

    pdfDocument.fontSize(20).text('PH Healthcare System', {
        align: 'center',
    });

    pdfDocument.fontSize(14).text('Appointment Invoice', {
        align: 'center',
    });

    pdfDocument.moveDown(2);

    pdfDocument.fontSize(12);

    pdfDocument.text(`Patient Name: ${result.patient.name}`);
    pdfDocument.text(`Patient Email: ${result.patient.email}`);

    pdfDocument.moveDown();

    pdfDocument.text(`Doctor Name: ${result.doctor.name}`);
    pdfDocument.text(`Specialization: ${result.doctor.specialization}`);

    pdfDocument.moveDown();

    pdfDocument.text(
        `Appointment Date: ${result.schedule.startDateTime.toDateString()}`,
    );

    pdfDocument.text(
        `Joining Time: ${result.appointment.joiningTime?.toString()}`,
    );

    pdfDocument.text(`Serial Number: ${result.appointment.serialNumber}`);

    pdfDocument.text(`Meeting Link: ${result.schedule.meetingLink}`);

    pdfDocument.moveDown();

    pdfDocument.text(`Amount Paid: ${result.payment.amount} BDT`);
    pdfDocument.text('Payment Method: bKash');

    pdfDocument.text(`bKash Payment ID: ${result.payment.bkashPaymentId}`);

    pdfDocument.text(`bKash Transaction ID: ${result.payment.bkashTrxId}`);

    pdfDocument.text(`Paid At: ${result.payment.paidAt}`);

    pdfDocument.end();

    const pdfBuffer = await pdfReadyPromise;

    // 10. Send invoice email
    await transporter.sendMail({
        from: config.email_sender,
        to: result.patient.email,
        subject: 'Your Appointment Invoice - PH Healthcare System',
        text: 'Your appointment payment was successful. Please find your invoice attached.',
        attachments: [
            {
                filename: 'appointment-invoice.pdf',
                content: pdfBuffer,
            },
        ],
    });

    return {
        redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=success`,
    };
};

const cancelAppointment = async (
    payload: ICancelAppointmentPayload,
    user: RequestUser,
) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const appointmentId = payload.appointmentId;

        const existingAppointment = await tx.appointment.findUnique({
            where: {
                id: appointmentId,
                patient: {
                    email: user.email,
                },
            },
            include: {
                payment: true,
                schedule: true,
            },
        });

        if (!existingAppointment) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Appointment Does Not Exists',
            );
        }

        if (
            existingAppointment.status === 'ONGOING' ||
            existingAppointment.status === 'COMPLETED'
        ) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Appointment Ongoing or Completed',
            );
        }

        if (existingAppointment.status === 'CANCELLED') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Appointment Already Cancelled',
            );
        }

        const updatedAppointment = await tx.appointment.update({
            where: {
                id: existingAppointment.id,
            },
            data: {
                status: AppointmentStatus.CANCELLED,
            },
        });

        await prisma.schedule.update({
            where: {
                id: existingAppointment.schedule.id,
            },
            data: {
                availableSlots: { increment: 1 },
            },
        });

        // refund process
        const now = new Date();
        const startDateTime = existingAppointment.schedule.startDateTime; // 25 August : 3:00 PM

        // After 2:00 Pm => no refund
        // must cancel before  2:00 PM
        const refundCutOffTime = subHours(startDateTime, 1);

        // now >  refuncCutOff Time => no refund
        // now < refundCutOff Time => refund eligible
        const isEligibleForRefund = isBefore(now, refundCutOffTime);

        if (isEligibleForRefund) {
            const bkashIdToken = await getBKashIdToken();

            if (!bkashIdToken) {
                throw new AppError(
                    httpStatus.BAD_GATEWAY,
                    'No Bkash Access Token Found!',
                );
            }

            const bkashRefundPaymentResponse = await fetch(
                `${config.bkash_base_url}/tokenized/checkout/payment/refund`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: bkashIdToken,
                        'X-App-Key': config.bkash_app_key,
                    },
                    body: JSON.stringify({
                        paymentID: existingAppointment.payment?.bkashPaymentId,
                        trxID: existingAppointment.payment?.bkashTrxId,
                        amount: existingAppointment.payment?.amount.toString(),
                        sku: 'Appointment Cancellation',
                        reason: 'Patient Cancelled The Appointment',
                    }),
                },
            );

            const bkashRefundPaymentResult =
                await bkashRefundPaymentResponse.json();

            await tx.payment.update({
                where: {
                    appointmentId: existingAppointment.id,
                },
                data: {
                    refundTrxId: bkashRefundPaymentResult.refundTrxID,
                    refundedAt: bkashRefundPaymentResult.completedTime,
                    refundAmount: bkashRefundPaymentResult.amount,
                    refundReason: 'Patient Cancelled The Appointment',
                    status: PaymentStatus.REFUNDED,
                    gatewayResponse: bkashRefundPaymentResult,
                },
            });
        }

        const newPaymentInfo = await prisma.payment.findUnique({
            where: {
                appointmentId: existingAppointment.id,
            },
        });

        return {
            appointment: updatedAppointment,
            payment: newPaymentInfo,
        };
    });

    return transactionResult;
};

// DOCTOR ONLY CONFIRMED => ONGOING => COMPLETED
const updateAppointmentStatus = async (
    appointmentId: string,
    payload: IUpdateAppointmentStatusPayload,
    user: RequestUser,
) => {
    const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
    });

    if (!doctor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor Profile Not Found');
    }

    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId, doctorId: doctor.id },
    });

    if (!appointment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Appointment Not Found');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Appointment is already completed',
        );
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Appointment is already cancelled',
        );
    }
    if (appointment.status === AppointmentStatus.PENDING) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Appointment is Pending. You can change the status after appointment is confirmed',
        );
    }

    if (appointment.status === AppointmentStatus.CONFIRMED) {
        if (payload.status !== 'ONGOING') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Confirmed Appointment Must Be Ongoing At First',
            );
        }

        await prisma.appointment.update({
            where: {
                id: appointment.id,
            },
            data: {
                status: AppointmentStatus.ONGOING,
            },
        });
    }

    if (appointment.status === AppointmentStatus.ONGOING) {
        if (payload.status !== 'COMPLETED') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Ongoinf Appointment Must Be Complted.',
            );
        }

        await prisma.appointment.update({
            where: {
                id: appointment.id,
            },
            data: {
                status: AppointmentStatus.COMPLETED,
            },
        });
    }

    const updatedAppointment = await prisma.appointment.findUnique({
        where: {
            id: appointment.id,
        },
    });

    return updatedAppointment;
};

//patient appointments
const getMyAppointments = async (query: IQuery, user: RequestUser) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

    const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
    });

    if (!patient) {
        throw new AppError(httpStatus.NOT_FOUND, 'Patient Profile Not Found');
    }

    const andConditions: AppointmentWhereInput[] = [
        {
            patientId: patient.id,
        },
    ];

    if (query.status) {
        andConditions.push({ status: query.status });
    }

    const appointments = await prisma.appointment.findMany({
        where: { AND: andConditions },
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
            doctor: { select: { id: true, name: true, specialization: true } },
            schedule: true,
            payment: true,
        },
    });

    const total = await prisma.appointment.count({
        where: { AND: andConditions },
    });

    return {
        data: appointments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

//doctor appointments
const getDoctorAppointments = async (query: IQuery, user: RequestUser) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

    const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
    });

    if (!doctor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor Profile Not Found');
    }

    const andConditions: AppointmentWhereInput[] = [
        {
            doctorId: doctor.id,
        },
    ];

    if (query.status) {
        andConditions.push({ status: query.status });
    }

    const appointments = await prisma.appointment.findMany({
        where: { AND: andConditions },
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
            patient: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contactNumber: true,
                },
            },
            schedule: true,
            payment: true,
        },
    });

    const total = await prisma.appointment.count({
        where: { AND: andConditions },
    });

    return {
        data: appointments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

//admin super admin
const getAllAppointments = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

    const andConditions: AppointmentWhereInput[] = [];

    if (query.status) {
        andConditions.push({ status: query.status });
    }

    if (query.doctorId) {
        andConditions.push({ doctorId: query.doctorId });
    }

    if (query.patientId) {
        andConditions.push({ patientId: query.patientId });
    }

    if (query.doctorEmail) {
        andConditions.push({
            doctor: {
                email: query.doctorEmail,
            },
        });
    }
    if (query.patientEmail) {
        andConditions.push({
            patient: {
                email: query.patientEmail,
            },
        });
    }

    const appointments = await prisma.appointment.findMany({
        where: { AND: andConditions },
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
            patient: { select: { id: true, name: true, email: true } },
            doctor: { select: { id: true, name: true, specialization: true } },
            schedule: true,
            payment: true,
        },
    });

    const total = await prisma.appointment.count({
        where: { AND: andConditions },
    });

    return {
        data: appointments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// for all loggedin user
const getSingleAppointment = async (
    appointmentId: string,
    user: RequestUser,
) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: {
                select: { id: true, name: true, email: true, userId: true },
            },
            doctor: {
                select: {
                    id: true,
                    name: true,
                    specialization: true,
                    userId: true,
                },
            },
            schedule: true,
            payment: true,
        },
    });

    if (!appointment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Appointment Not Found');
    }

    if (user.role === Role.PATIENT) {
        if (appointment.patient.userId !== user.id) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                'You Are Not Allowed To View This Appointment',
            );
        }
    }
    if (user.role === Role.DOCTOR) {
        if (appointment.doctor.userId !== user.id) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                'You Are Not Allowed To View This Appointment',
            );
        }
    }

    return appointment;
};

export const AppointmentServices = {
    bookAppointmentIntoDB: bookAppointment,
    payAppointmentIntoDB: payAppointment,
    bookAppointmentCallbackIntoDB: bookAppointmentCallback,
    cancelAppointmentIntoDB: cancelAppointment,
    updateAppointmentStatusIntoDB: updateAppointmentStatus,
    getMyAppointmentsIntoDB: getMyAppointments,
    getDoctorAppointmentsIntoDB: getDoctorAppointments,
    getAllAppointmentsIntoDB: getAllAppointments,
    getSingleAppointmentIntoDB: getSingleAppointment,
};
