import { Router } from 'express';
import { createConversation, listConversations, listMessages, postMessage } from '../controllers/conversationController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();
router.use(requireAuth);

router.get('/', listConversations);
router.post('/', createConversation);
router.get('/:id/messages', listMessages);
router.post('/:id/messages', postMessage);

export default router;
