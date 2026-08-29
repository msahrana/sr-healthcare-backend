import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.get(
    '/all-payments',
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    PaymentControllers.getAllPayments,
);

router.get(
    '/my-payments',
    auth(Role.PATIENT),
    PaymentControllers.getMyPayments,
);

router.get(
    '/:paymentId',
    auth(Role.PATIENT, Role.ADMIN, Role.SUPER_ADMIN),
    PaymentControllers.getSinglePayment,
);

export const PaymentRoutes = router;
