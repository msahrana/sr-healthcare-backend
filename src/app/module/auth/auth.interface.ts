import type { Role, UserStatus } from '../../../generated/prisma/browser';

export interface ILoginUserPayload {
    email: string;
    password: string;
}

export interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
    patient?: {
        contactNumber?: string;
    };
    // emailVerified: boolean;
    // role: Role;
    // status: UserStatus;
    // needPasswordChange: boolean;
    // isDeleted: boolean;
    // googleId?: string | null;
    // deletedAt?: Date | null;
    // createdAt?: Date;
    // updatedAt?: Date;
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
