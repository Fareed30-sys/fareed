import { Router } from 'express';
import {
  createConversation,
  getConversations,
  getConversationById,
  sendChatMessage,
  deleteConversation,
} from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createConversationSchema,
  chatMessageSchema,
} from '../schemas/chat.schema.js';

const router = Router();

router.use(authenticate);

router.post('/conversations', validate(createConversationSchema), createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.post('/conversations/:id/messages', validate(chatMessageSchema), sendChatMessage);
router.delete('/conversations/:id', deleteConversation);

export default router;

