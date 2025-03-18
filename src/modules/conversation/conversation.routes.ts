import express from 'express';
import {
    createConversation,
    deleteConversation,
    getConversations,
} from './conversation.controller';

const conversationsRouter = express.Router();

conversationsRouter.post('/', createConversation);
conversationsRouter.get('/', getConversations);
conversationsRouter.delete('/:id', deleteConversation);

export default conversationsRouter;
