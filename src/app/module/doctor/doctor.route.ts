import { DoctorControllers } from './doctor.controller';
import { upload } from '../../lib/multer';
import { Router } from 'express';
import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.post(
    '/apply-as-doctor',
    upload.fields([
        {
            name: 'resume',
            maxCount: 1,
        },
        {
            name: 'additionalFiles',
            maxCount: 10,
        },
    ]),
    DoctorControllers.applyAsDoctor,
);

router.post(
    '/apply-as-doctor/verify-email',
    DoctorControllers.verifyDoctorEmail,
);

router.post(
    '/approve-doctor',
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorControllers.verifyDoctorEmail,
);

router.get(
    '/all-doctors',
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorControllers.getAllDoctors,
);

export const DoctorRoutes = router;
