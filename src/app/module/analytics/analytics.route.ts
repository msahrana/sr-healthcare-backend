import { Router } from 'express';
import { AnalyticsControllers } from './analytics.controller';
import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.get(
    '/patient-analytics',
    auth(Role.PATIENT),
    AnalyticsControllers.getPatientAnalytics,
);

router.get(
    '/doctor-analytics',
    auth(Role.DOCTOR),
    AnalyticsControllers.getDoctorAnalytics,
);

router.get(
    '/admin-analytics',
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    AnalyticsControllers.getAdminAnalytics,
);

export const AnalyticsRoutes = router;
