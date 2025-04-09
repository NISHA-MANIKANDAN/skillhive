import express from 'express';
import { handleChatRequest } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/', handleChatRequest);

export default router;
