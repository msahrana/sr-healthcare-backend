import { AppointmentControllers } from './appointment.controller';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { Router } from 'express';

const router = Router();

router.post(
    '/book-appointment',
    auth(Role.PATIENT),
    AppointmentControllers.bookAppointment,
);

router.post(
    '/pay-appointment',
    auth(Role.PATIENT),
    AppointmentControllers.payAppointment,
);

router.post(
    '/cancel-appointment',
    auth(Role.PATIENT, Role.ADMIN, Role.SUPER_ADMIN),
    AppointmentControllers.cancelAppointment,
);

//book appointment callback url
router.get(
    '/book-appointment/payment/callback',
    AppointmentControllers.bookAppointmentCallback,
);

export const AppointmentRoutes = router;
