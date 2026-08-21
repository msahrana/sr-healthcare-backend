import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';

const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {});

export const DoctorControllers = {
    applyAsDoctor,
};
