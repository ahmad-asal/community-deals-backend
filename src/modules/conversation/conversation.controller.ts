// controllers/conversations.controller.ts
import { Request, Response, NextFunction } from 'express';
import conversationService from './conversation.service';

export const createConversation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user1Id, user2Id } = req.body;
        const conversation = await conversationService.createConversation(
            user1Id,
            user2Id,
        );
        res.status(201).json(conversation);
    } catch (error) {
        next(error);
    }
};

export const getConversations = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.query;
        const conversations = await conversationService.getConversations(
            Number(userId),
        );
        res.status(200).json(conversations);
    } catch (error) {
        next(error);
    }
};

export const deleteConversation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const authorization = req.headers.authorization;

        const accessToken: any = authorization?.split(' ')[1];
        await conversationService.deleteConversation(Number(id), accessToken);
        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const unreadMsgsCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authorization = req.headers.authorization;

        const accessToken: any = authorization?.split(' ')[1];
        const unreadCount = await conversationService.unreadMsgsCount(
            accessToken,
        );
        res.status(200).json({ unreadCount });
    } catch (error) {
        next(error);
    }
};
