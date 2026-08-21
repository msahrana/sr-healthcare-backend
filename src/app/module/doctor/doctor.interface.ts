export interface IApplyAsDoctorPayload {
    user: {
        name: string;
        email: string;
    };

    doctor: {
        specialization: string;
        designation: string;
        qualification: string;
        experience: number;
        bio?: string;
    };
}
