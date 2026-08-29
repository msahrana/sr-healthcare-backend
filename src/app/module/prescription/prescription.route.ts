import { Router } from 'express';
import { PrescriptionControllers } from './prescription.controller';
import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import { CreatePrescriptionValidationZodSchema } from './prescription.validation';

const router = Router();

router.post(
    '/create-prescription',
    auth(Role.DOCTOR),
    validateRequest(CreatePrescriptionValidationZodSchema),
    PrescriptionControllers.createPrescription,
);

router.get(
    '/:appointmentId',
    auth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),
    PrescriptionControllers.getSinglePrescription,
);

export const PrescriptionRoutes = router;
