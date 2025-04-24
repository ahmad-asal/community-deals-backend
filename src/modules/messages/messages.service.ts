import { CustomError } from '@/utils/custom-error';
import messageRepo from './messages.repo';
import { MessageModel } from '@/database/models';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const messageService = {
    createMessage: async (
        conversationId: number,
        senderId: number,
        content: string,
    ) => {
        if (!conversationId || !senderId || !content) {
            throw new Error(
                'Conversation ID, sender ID, and content are required.',
            );
        }

        const message = await MessageModel.create({
            conversationId,
            senderId,
            content,
        });

        return message;
    },

    getMessagesByConversation: async (
        conversationId: number,
        accessToken: string,
    ) => {
        const decodeToken: JwtPayload = await verifyJWT(
            accessToken,
            JWT_ACCESS_TOKEN_SECRET as string,
        );

        const userId = decodeToken.userId;
        if (!conversationId) {
            throw new CustomError('Conversation ID is required.', 400);
        }

        return await messageRepo.getMessagesByConversation(
            conversationId,
            userId,
        );
    },

    markMessagesRead: async (conversationId: number, userId: number) => {
        if (!conversationId || !userId) {
            throw new CustomError(
                'Conversation ID and User ID are required.',
                400,
            );
        }

        return await messageRepo.markMessagesRead(conversationId, userId);
    },

    deleteMessage: async (messageId: number) => {
        if (!messageId) {
            throw new CustomError('Message ID is required.', 400);
        }

        return await messageRepo.deleteMessage(messageId);
    },
};

export default messageService;
