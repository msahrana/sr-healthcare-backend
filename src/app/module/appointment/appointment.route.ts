import { AppointmentController } from './appointment.controller';
import { Router } from 'express';

const router = Router();

router.post('/book-appointment', AppointmentController.bookAppointment);

//book appointment callback url
router.get(
    '/book-appointment/payment/callback',
    AppointmentController.bookAppointmentCallback,
);

export const AppointmentRoutes = router;
