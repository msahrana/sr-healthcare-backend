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

const cancelAppointment = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await AppointmentServices.cancelAppointmentIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment Cancelled And Refunded Successfully!',
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

export const AppointmentControllers = {
    bookAppointment,
    payAppointment,
    cancelAppointment,
    bookAppointmentCallback,
};
