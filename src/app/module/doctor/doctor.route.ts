import { Router } from 'express';
import { DoctorControllers } from './doctor.controller';

const router = Router();

router.post('/apply-as-doctor', DoctorControllers.applyAsDoctor);

export const DoctorRoutes = router;
