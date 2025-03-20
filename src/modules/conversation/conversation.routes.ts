import express from 'express';
import {
    createConversation,
    deleteConversation,
    getConversations,
    unreadMsgsCount,
} from './conversation.controller';

const conversationsRouter = express.Router();

conversationsRouter.post('/', createConversation);
conversationsRouter.get('/', getConversations);
conversationsRouter.delete('/:id', deleteConversation);
conversationsRouter.get('/unread-count', unreadMsgsCount);

export default conversationsRouter;
