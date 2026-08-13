import type { Role, UserStatus } from '../../../generated/prisma/browser';

export interface ILoginUserPayload {
    email: string;
    password: string;
}

export interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
    patient: {
        contactNumber?: string;
    };
}

export interface IRequestUser {
    id: string;
    email: string;
    name: string;
    role: Role;
    status: UserStatus;
}

export type UpdateProfilePayload = {
    name?: string;
    email?: string;
};

export interface IGoogleLoginPayload {
    idToken: string;
}

export interface IForgotPasswordPayload {
    email: string;
}
export interface IResetPasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
}

export interface IVerifyEmailPayload {
	email: string;
	otp : string;
}
