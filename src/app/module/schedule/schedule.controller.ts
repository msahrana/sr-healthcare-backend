import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ScheduleServices } from './schedule.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user!;

    const result = await ScheduleServices.createScheduleIntoDB(payload, user);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Schedule Created Successfully!',
        data: result,
    });
});

const getMySchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const query = req.query;

    const { data, meta } = await ScheduleServices.getMySchedulesIntoDB(
        query,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedules Retrieved Successfully!',
        data,
        meta,
    });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const { data, meta } = await ScheduleServices.getAllSchedulesIntoDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedules Retrieved Successfully!',
        data,
        meta,
    });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
    const scheduleId = req.params.scheduleId as string;

    const result = await ScheduleServices.getScheduleByIdIntoDB(scheduleId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule Retrieved Successfully!',
        data: result,
    });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
    const scheduleId = req.params.scheduleId as string;
    const payload = req.body;
    const user = req.user!;

    const result = await ScheduleServices.updateScheduleIntoDB(
        scheduleId,
        payload,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule Updated Successfully!',
        data: result,
    });
});

const publishSchedule = catchAsync(async (req: Request, res: Response) => {
    const scheduleId = req.params.scheduleId as string;
    const user = req.user!;

    const result = await ScheduleServices.publishScheduleIntoDB(
        scheduleId,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule Published Successfully!',
        data: result,
    });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const scheduleId = req.params.scheduleId as string;
    const user = req.user!;

    const result = await ScheduleServices.deleteScheduleIntoDB(
        scheduleId,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule Deleted Successfully!!!',
        data: result,
    });
});

const getTodaysSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const { data, meta } =
        await ScheduleServices.getTodaysSchedulesIntoDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Today's Schedules Retrieved Successfully!",
        data,
        meta,
    });
});

export const ScheduleControllers = {
    createSchedule,
    getMySchedules,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    publishSchedule,
    deleteSchedule,
    getTodaysSchedules,
};
