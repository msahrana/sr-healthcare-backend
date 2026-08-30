import { Router } from 'express';
import { ScheduleControllers } from './schedule.controller';
import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import {
    CreateScheduleValidationZodSchema,
    UpdateScheduleValidationZodSchema,
} from './schedule.validation';

const router = Router();

router.post(
    '/create-schedule',
    auth(Role.DOCTOR),
    validateRequest(CreateScheduleValidationZodSchema),
    ScheduleControllers.createSchedule,
);

router.get(
    '/my-schedules',
    auth(Role.DOCTOR),
    ScheduleControllers.getMySchedules,
);

router.get('/todays-schedule', ScheduleControllers.getTodaysSchedules);

router.get(
    '/all-schedules',
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    ScheduleControllers.getAllSchedules,
);

router.get(
    '/:scheduleId',
    auth(Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),
    ScheduleControllers.getScheduleById,
);

router.patch(
    '/update-schedule/:scheduleId',
    auth(Role.DOCTOR),
    validateRequest(UpdateScheduleValidationZodSchema),
    ScheduleControllers.updateSchedule,
);

router.patch(
    '/publish-schedule/:scheduleId',
    auth(Role.DOCTOR),
    ScheduleControllers.publishSchedule,
);

router.delete(
    '/:scheduleId',
    auth(Role.DOCTOR),
    ScheduleControllers.deleteSchedule,
);

export const ScheduleRoutes = router;
