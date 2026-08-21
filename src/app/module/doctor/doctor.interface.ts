export interface IApplyAsDoctorPayload {
    user: {
        name: string;
        email: string;
    };

    doctor: {
        specialization: string;
        licenseNumber: string;
        qualifications: string;
        address?: string;
        experienceYears: number;
        bio?: string;
        consultationFee?: number;
        contactNumber?: string;
    };
}
