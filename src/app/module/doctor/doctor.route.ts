import { DoctorControllers } from './doctor.controller';
import { upload } from '../../lib/multer';
import { Router } from 'express';

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

export const DoctorRoutes = router;
