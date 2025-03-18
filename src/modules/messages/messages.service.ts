import { CustomError } from '@/utils/custom-error';
import messageRepo from './messages.repo';
import { MessageModel } from '@/database/models';

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

    getMessagesByConversation: async (conversationId: number) => {
        if (!conversationId) {
            throw new CustomError('Conversation ID is required.', 400);
        }

        return await messageRepo.getMessagesByConversation(conversationId);
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
