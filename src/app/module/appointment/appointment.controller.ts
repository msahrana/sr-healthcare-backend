import { AppointmentServices } from './appointment.service';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user!;

    const result = await AppointmentServices.bookAppointmentIntoDB(
        payload,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment Payment Initiated Successfully!',
        data: result,
    });
});

const payAppointment = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user!;

    const result = await AppointmentServices.payAppointmentIntoDB(
        payload,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment Payment Initiated Successfully!',
        data: result,
    });
});

const bookAppointmentCallback = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { redirectUrl } =
            await AppointmentServices.bookAppointmentCallbackIntoDB(query);

        res.redirect(redirectUrl);

        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: "User profile fetched successfully",
        //     data: result,
        // });
    },
);

const cancelAppointment = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user!;

    const result = await AppointmentServices.cancelAppointmentIntoDB(
        payload,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment Cancelled And Refunded Successfully!',
        data: result,
    });
});

const updateAppointmentStatus = catchAsync(
    async (req: Request, res: Response) => {
        const appointmentId = req.params.appointmentId as string;
        const payload = req.body;
        const user = req.user!;

        const result = await AppointmentServices.updateAppointmentStatusIntoDB(
            appointmentId,
            payload,
            user,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Appointment Status Updated Successfully!',
            data: result,
        });
    },
);

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const query = req.query;

    const { data, meta } = await AppointmentServices.getMyAppointmentsIntoDB(
        query,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointments Retrieved Successfully!',
        data,
        meta,
    });
});

const getDoctorAppointments = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user!;
        const query = req.query;

        const { data, meta } =
            await AppointmentServices.getDoctorAppointmentsIntoDB(query, user);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Appointments Retrieved Successfully!',
            data,
            meta,
        });
    },
);

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const { data, meta } =
        await AppointmentServices.getAllAppointmentsIntoDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointments Retrieved Successfully!',
        data,
        meta,
    });
});

const getSingleAppointment = catchAsync(async (req: Request, res: Response) => {
    const appointmentId = req.params.appointmentId as string;
    const user = req.user!;

    const result = await AppointmentServices.getSingleAppointmentIntoDB(
        appointmentId,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment Retrieved Successfully!',
        data: result,
    });
});

export const AppointmentControllers = {
    bookAppointment,
    payAppointment,
    bookAppointmentCallback,
    cancelAppointment,
    updateAppointmentStatus,
    getMyAppointments,
    getDoctorAppointments,
    getAllAppointments,
    getSingleAppointment,
};
