import { ApplyAsDoctorValidationZodSchema } from './doctor.validation';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { DoctorServices } from './doctor.service';
import { AppError } from '../../utils/AppError';
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
        throw new AppError(
            httpStatus.BAD_REQUEST,
            zodValidationResult.error.issues[0].message,
        );
    }

    const payload = zodValidationResult.data;

    await DoctorServices.applyAsDoctorIntoDB(payload, resume, additionalFiles);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Verification OTP Sent & Verification Your Account...!',
        data: null,
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

const updateDoctorProfile = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user!;

    const result = await DoctorServices.updateDoctorProfileIntoDB(
        payload,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctor Profile Updated Successfully!',
        data: result,
    });
});

const getAvailableDoctorByTodaysSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { data, meta } =
            await DoctorServices.getAvailableDoctorByTodaysScheduleIntoDB(
                query,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Today's Available Doctors Retrieved Successfully!",
            data,
            meta,
        });
    },
);

const getAllDoctorsListPublic = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { data, meta } =
            await DoctorServices.getAllDoctorsListPublicIntoDB(query);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Doctors Retrieved Successfully!',
            data,
            meta,
        });
    },
);

const getSingleDoctorPublicProfile = catchAsync(
    async (req: Request, res: Response) => {
        const doctorId = req.params.doctorId as string;

        const result =
            await DoctorServices.getSingleDoctorPublicProfileIntoDB(doctorId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Doctor Profile Retrieved Successfully!',
            data: result,
        });
    },
);

export const DoctorControllers = {
    applyAsDoctor,
    verifyDoctorEmail,
    approveDoctor,
    getAllDoctors,
    updateDoctorProfile,
    getAvailableDoctorByTodaysSchedule,
    getAllDoctorsListPublic,
    getSingleDoctorPublicProfile,
};
