// controllers/messages.controller.ts
import { Request, Response, NextFunction } from 'express';
import messageService from './messages.service';
import { ConversationModel } from '@/database/models';
export const createMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { conversationId, senderId, content } = req.body;

        const message = await messageService.createMessage(
            conversationId,
            senderId,
            content,
        );

        const updatedConversation = await ConversationModel.update(
            {
                lastMessage: content,
                lastMessageAt: new Date(),
            },
            {
                where: { id: conversationId },
                returning: true,
            },
        );
        res.status(201).json({
            message,
            updatedConversation: updatedConversation[1][0],
        });
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { conversationId } = req.params;
        const authorization = req.headers.authorization;

        const accessToken: any = authorization?.split(' ')[1];
        const messages = await messageService.getMessagesByConversation(
            Number(conversationId),
            accessToken,
        );
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

export const markMessagesRead = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { conversationId, userId } = req.body;
        await messageService.markMessagesRead(conversationId, userId);
        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        next(error);
    }
};

export const deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        await messageService.deleteMessage(Number(id));
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        next(error);
    }
};
