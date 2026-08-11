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
    res.send(`<h2 style="
            font-family: 'Arial', sans-serif;

            font-size: 45px;
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            Hello, Welcome to 
            <span style="color: cyan; ">SR Health</span><span style="color: red;">Care</span>
            Backend Server <span style="color: red;">!!!</span>
        </h2>`);
});
app.get('/', async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Welcome to SR Healthcare Backend System!',
    });
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
