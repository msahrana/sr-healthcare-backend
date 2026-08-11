import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { UserValidation } from './auth.validation';

const router = Router();

router.post(
    '/register',
    validateRequest(UserValidation.PatientRegistrationZodSchema),
    AuthController.registerPatient,
);
router.post(
    '/login',
    validateRequest(UserValidation.LoginZodSchema),
    AuthController.loginUser,
);
router.get(
    '/me',
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    AuthController.getMe,
);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/all-users', AuthController.getAllUsers);
router.get('/user/:id', AuthController.getUserById);
router.put(
    '/my-profile',
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    AuthController.updateMyProfile,
);
router.post(
    '/change-password',
    auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
    AuthController.changePassword,
);
router.post('/google', AuthController.googleLogin);

export const AuthRoutes = router;
