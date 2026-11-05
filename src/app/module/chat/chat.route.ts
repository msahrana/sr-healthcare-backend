import { Router } from 'express';
import { ChatControllers } from './chat.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { SendChatMessageZodSchema } from './chat.validation';

const router = Router();

router.post(
    '/',
    validateRequest(SendChatMessageZodSchema),
    ChatControllers.sendMessage,
);

export const ChatRoutes = router;
