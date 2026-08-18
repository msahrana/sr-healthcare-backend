import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
    NextFunction,
    type Application,
    type Request,
    type Response,
} from 'express';
import httpStatus from 'http-status';
import config from './app/config';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import { AuthRoutes } from './app/module/auth/auth.route';
import z from 'zod';
import { AppointmentRoutes } from './app/module/appointment/appointment.route';
import { getBKashIdToken } from './app/lib/bkash';
// import crypto from 'crypto';

const app: Application = express();

app.use(
    cors({
        origin: config.frontend_url,
        credentials: true,
    }),
);

// Enable URL-encoded form data parsing / parser
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// application routes
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/appointment', AppointmentRoutes);

// testing routes
// app.get('/test', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // 100000 > 999999 > 1000000
//         const otp = crypto.randomInt(100000, 1000000); // (1, 11) 1, 2, 3, 4, 5, 6,7,8 ,9, 10 => X-11

//         // await redisClient.set(
//         //     'forgot-password-otp:patient1@gmail.com',
//         //     '123456',
//         //     {
//         //         expiration: {
//         //             type: 'EX',
//         //             value: 60,
//         //         },
//         //     },
//         // );

//         res.status(httpStatus.OK).json({
//             success: true,
//             message: 'Welcome to SR Healthcare Backend System!',
//             data: otp,
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// });
app.get('/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const grantIdTokenResult = await getBKashIdToken();

        console.log(grantIdTokenResult);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Welcome to SR Healthcare Backend System!',
            data: null,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});
app.use('/zod', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const UserZodSchema = z.object({
            name: z.string().endsWith('r'),
            email: z.email(),
            age: z.number().optional(),
            isVerified: z.boolean().optional(),
            books: z.array(z.string()).optional(),
        });

        const payload = req.body;

        const result = UserZodSchema.safeParse(payload);

        if (!result.success) {
            console.log(result.error);
        }
        if (result.success) {
            console.log(result.data);
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Welcome to SR Healthcare Backend System!',
            data: result,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send(`
    <div style="
      min-height: 100vh;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background: #F7FBFF;
      color: #0B1F3A;
      font-family: Arial, Helvetica, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    ">

      <div style="
        width: 90%;
        max-width: 1100px;
        padding: 55px 25px;
        text-align: center;
      ">

        <!-- ================= LOGO ================= -->

        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 25px;
        ">

          <div style="
            width: 55px;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563EB, #0EA5E9);
            color: #FFFFFF;
            font-size: 21px;
            font-weight: 800;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.25);
          ">
            SR
          </div>

          <div style="
            font-size: 30px;
            font-weight: 800;
            letter-spacing: -1px;
          ">
            <span style="color: #0B2A4A;">SR</span>
            <span style="color: #2563EB;"> HealthCare</span>
          </div>

        </div>


        <!-- ================= BADGE ================= -->

        <div style="
          display: inline-block;
          padding: 9px 18px;
          margin-bottom: 20px;
          border-radius: 999px;
          background: #E8F7F8;
          border: 1px solid #BDE9EC;
          color: #087F8C;
          font-size: 14px;
          font-weight: 600;
        ">
          Your Health, Our Priority
        </div>


        <!-- ================= TITLE ================= -->

        <h1 style="
          margin: 0;
          font-size: 52px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -2px;
        ">

          <span style="color: #0B2A4A;">
            SR HealthCare
          </span>

          <br />

          <span style="color: #2563EB;">
            Backend Server
          </span>

        </h1>


        <!-- ================= DESCRIPTION ================= -->

        <p style="
          max-width: 700px;
          margin: 22px auto 30px;
          color: #60758A;
          font-size: 17px;
          line-height: 1.8;
        ">
          A secure and reliable healthcare backend platform designed
          to power doctor appointments, online consultations,
          patient management, digital prescriptions and secure
          healthcare services.
        </p>


        <!-- ================= STATUS ================= -->

        <div style="
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          border-radius: 999px;
          background: #ECFDF5;
          border: 1px solid #BBF7D0;
          color: #15803D;
          font-size: 14px;
          font-weight: 700;
        ">

          <span style="
            width: 9px;
            height: 9px;
            display: inline-block;
            border-radius: 50%;
            background: #22C55E;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.55);
          "></span>

          Backend Server is Running
        </div>


        <!-- ================= SYSTEM INFO ================= -->

        <div style="
          margin-top: 45px;
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        ">


          <!-- API -->

          <div style="
            min-width: 150px;
            padding: 16px 20px;
            background: #FFFFFF;
            border: 1px solid #DCE8F5;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(30, 64, 175, 0.06);
          ">

            <div style="
              color: #8A9BAD;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 6px;
              text-transform: uppercase;
            ">
              API
            </div>

            <div style="
              color: #2563EB;
              font-size: 15px;
              font-weight: 700;
            ">
              Online
            </div>

          </div>


          <!-- ENVIRONMENT -->

          <div style="
            min-width: 170px;
            padding: 16px 20px;
            background: #FFFFFF;
            border: 1px solid #DCE8F5;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(30, 64, 175, 0.06);
          ">

            <div style="
              color: #8A9BAD;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 6px;
              text-transform: uppercase;
            ">
              Environment
            </div>

            <div style="
              color: #0B2A4A;
              font-size: 15px;
              font-weight: 700;
            ">
              ${process.env.NODE_ENV || 'Development'}
            </div>

          </div>


          <!-- STATUS -->

          <div style="
            min-width: 150px;
            padding: 16px 20px;
            background: #FFFFFF;
            border: 1px solid #DCE8F5;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(30, 64, 175, 0.06);
          ">

            <div style="
              color: #8A9BAD;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 6px;
              text-transform: uppercase;
            ">
              Status
            </div>

            <div style="
              color: #16A34A;
              font-size: 15px;
              font-weight: 700;
            ">
              Healthy
            </div>

          </div>


          <!-- VERSION -->

          <div style="
            min-width: 150px;
            padding: 16px 20px;
            background: #FFFFFF;
            border: 1px solid #DCE8F5;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(30, 64, 175, 0.06);
          ">

            <div style="
              color: #8A9BAD;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 6px;
              text-transform: uppercase;
            ">
              Version
            </div>

            <div style="
              color: #2563EB;
              font-size: 15px;
              font-weight: 700;
            ">
              API v1
            </div>

          </div>

        </div>


        <!-- ================= SERVICES ================= -->

        <div style="
          margin-top: 48px;
        ">

          <h2 style="
            margin: 0 0 22px;
            font-size: 24px;
            color: #0B2A4A;
            font-weight: 750;
          ">
            Healthcare Platform Services
          </h2>


          <div style="
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
          ">


            <!-- Appointment -->

            <div style="
              display: flex;
              align-items: center;
              gap: 9px;
              padding: 13px 17px;
              background: #FFFFFF;
              border: 1px solid #DCE8F5;
              border-radius: 10px;
              color: #173B5E;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 5px 18px rgba(30, 64, 175, 0.05);
            ">
              <span style="color: #2563EB; font-size: 18px;">+</span>
              Appointments
            </div>


            <!-- Doctors -->

            <div style="
              display: flex;
              align-items: center;
              gap: 9px;
              padding: 13px 17px;
              background: #FFFFFF;
              border: 1px solid #DCE8F5;
              border-radius: 10px;
              color: #173B5E;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 5px 18px rgba(30, 64, 175, 0.05);
            ">
              <span style="color: #0EA5A4; font-size: 18px;">+</span>
              Doctors
            </div>


            <!-- Patients -->

            <div style="
              display: flex;
              align-items: center;
              gap: 9px;
              padding: 13px 17px;
              background: #FFFFFF;
              border: 1px solid #DCE8F5;
              border-radius: 10px;
              color: #173B5E;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 5px 18px rgba(30, 64, 175, 0.05);
            ">
              <span style="color: #2563EB; font-size: 18px;">+</span>
              Patients
            </div>


            <!-- Consultation -->

            <div style="
              display: flex;
              align-items: center;
              gap: 9px;
              padding: 13px 17px;
              background: #FFFFFF;
              border: 1px solid #DCE8F5;
              border-radius: 10px;
              color: #173B5E;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 5px 18px rgba(30, 64, 175, 0.05);
            ">
              <span style="color: #0EA5A4; font-size: 18px;">+</span>
              Video Consultation
            </div>


            <!-- Prescription -->

            <div style="
              display: flex;
              align-items: center;
              gap: 9px;
              padding: 13px 17px;
              background: #FFFFFF;
              border: 1px solid #DCE8F5;
              border-radius: 10px;
              color: #173B5E;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 5px 18px rgba(30, 64, 175, 0.05);
            ">
              <span style="color: #2563EB; font-size: 18px;">+</span>
              Digital Prescriptions
            </div>


            <!-- Payments -->

            <div style="
              display: flex;
              align-items: center;
              gap: 9px;
              padding: 13px 17px;
              background: #FFFFFF;
              border: 1px solid #DCE8F5;
              border-radius: 10px;
              color: #173B5E;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 5px 18px rgba(30, 64, 175, 0.05);
            ">
              <span style="color: #0EA5A4; font-size: 18px;">+</span>
              Secure Payments
            </div>

          </div>

        </div>


        <!-- ================= TECH STACK ================= -->

        <div style="
          margin-top: 35px;
          color: #91A4B7;
          font-size: 13px;
        ">
          Node.js · Express.js · TypeScript · Prisma · PostgreSQL · REST API
        </div>


        <!-- ================= FOOTER ================= -->

        <p style="
          margin-top: 45px;
          color: #9AAABC;
          font-size: 13px;
        ">
          © ${new Date().getFullYear()}
          <span style="
            color: #2563EB;
            font-weight: 700;
          ">
            SR HealthCare
          </span>
          · Your Health, Our Priority
        </p>

      </div>
    </div>
  `);
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
