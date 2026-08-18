import { AppointmentServices } from './appointment.service';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentServices.bookAppointmentIntoDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User profile fetched successfully!',
        data: result,
    });
});

const bookAppointmentCallback = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { executedPaymentResult, redirectUrl } =
            await AppointmentServices.bookAppointmentCallbackIntoDB(query);

        console.log({ executedPaymentResult }, 'callback controller');

        res.redirect(redirectUrl);
    },
);

export const AppointmentController = {
    bookAppointment,
    bookAppointmentCallback,
};
