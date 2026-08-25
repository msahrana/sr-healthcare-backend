import { ApplyAsDoctorValidationZodSchema } from './doctor.validation';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { DoctorServices } from './doctor.service';
// import { AppError } from "../../utils/AppError";
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const resume = files?.['resume'] ? files['resume'][0] : null;
    const additionalFiles = files?.['additionalFiles'] || [];

    const zodValidationResult = ApplyAsDoctorValidationZodSchema.safeParse(
        JSON.parse(req.body.data),
    );

    if (!zodValidationResult.success) {
        throw new Error(zodValidationResult.error.issues[0].message);
    }

    const payload = zodValidationResult.data;

    const result = await DoctorServices.applyAsDoctorIntoDB(
        payload,
        resume,
        additionalFiles,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Applied As Doctor Successful!!',
        data: result,
    });
});

const verifyDoctorEmail = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await DoctorServices.verifyDoctorEmailIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctor Email Verified Successfully',
        data: result,
    });
});

const approveDoctor = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user!;

    const result = await DoctorServices.approveDoctorIntoDB(payload, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctor Email Approved Successfully',
        data: result,
    });
});

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await DoctorServices.getAllDoctorsIntoDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Doctors Retrieved Successfully',
        data: data,
        meta: meta,
    });
});

export const DoctorControllers = {
    applyAsDoctor,
    verifyDoctorEmail,
    approveDoctor,
    getAllDoctors,
};
