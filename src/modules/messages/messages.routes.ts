import express from 'express';
import {
    createMessage,
    deleteMessage,
    getMessages,
    markMessagesRead,
} from './messages.controller';

const messagesRouter = express.Router();

messagesRouter.post('/', createMessage);
messagesRouter.get('/:conversationId', getMessages);
messagesRouter.patch('/read', markMessagesRead);
messagesRouter.delete('/:id', deleteMessage);

export default messagesRouter;
