import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IRequestUser } from './auth.interface';
import { AuthService } from './auth.service';

const registerPatient = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.registerPatientIntoDB(payload);

    const { accessToken, refreshToken, user, patient } = result;

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Patient Registered Successfully!',
        data: {
            accessToken,
            refreshToken,
            user,
            patient,
        },
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.loginUserIntoDB(payload);
    const { accessToken, refreshToken } = result;

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in Successfully!',
        data: {
            accessToken,
            refreshToken,
        },
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as unknown as IRequestUser;

    if (!user) {
        throw new Error('User information is missing in the request');
    }

    const result = await AuthService.getMeIntoDB(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Profile Fetched Successfully!',
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
        throw new Error('Refresh token is missing');
    }
    const result = await AuthService.refreshTokenIntoDB(
        req.cookies.refreshToken,
    );
    const { accessToken, refreshToken: newRefreshToken } = result;

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New tokens generated successfully',
        data: {
            accessToken,
            refreshToken: newRefreshToken,
        },
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.getAllUsersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Users Fetched Successfully!!',
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await AuthService.getUserByIdFromDB(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Found Successfully!',
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await AuthService.updateMyProfileIntoDB(userId, payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile Updated Successfully.',
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { oldPassword, newPassword } = req.body;

    const result = await AuthService.changePasswordIntoDB(
        userId,
        oldPassword,
        newPassword,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password Changed Successfully.',
        data: result,
    });
});

export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    refreshToken,
    getAllUsers,
    getUserById,
    updateMyProfile,
    changePassword,
};
