import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { PaymentServices } from './payment.service';
import httpStatus from 'http-status';
import { sendResponse } from '../../utils/sendResponse';

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const { data, meta } = await PaymentServices.getAllPaymentsIntoDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payments Retrieved Successfully!',
        data,
        meta,
    });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const query = req.query;

    const { data, meta } = await PaymentServices.getMyPaymentsIntoDB(
        query,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payments Retrieved Successfully!',
        data,
        meta,
    });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId as string;
    const user = req.user!;

    const result = await PaymentServices.getSinglePaymentIntoDB(
        paymentId,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment Retrieved Successfully!',
        data: result,
    });
});

export const PaymentControllers = {
    getAllPayments,
    getMyPayments,
    getSinglePayment,
};
