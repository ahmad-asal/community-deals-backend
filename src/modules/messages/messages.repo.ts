import { DB } from '@/database';
import { MessageModel } from '@/database/models';
import { Op } from 'sequelize';

const messageRepo = {
    getMessagesByConversation: async (conversationId: number) => {
        const conversation = await DB.Conversations.findOne({
            where: { id: conversationId },
            include: [
                {
                    model: DB.User,
                    as: 'User1',
                    attributes: ['id', 'name', 'profileImg'],
                },
                {
                    model: DB.User,
                    as: 'User2',
                    attributes: ['id', 'name', 'profileImg'],
                },
            ],
        });

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        // Fetch messages in this conversation
        const messages = await MessageModel.findAll({
            where: { conversationId },
            include: [
                {
                    model: DB.User,
                    as: 'Sender',
                    attributes: ['id', 'name', 'profileImg'],
                },
            ],
            order: [['createdAt', 'ASC']],
        });

        return {
            conversation, // Contains User1 & User2 info
            messages, // Contains chat messages
        };
    },

    markMessagesRead: async (conversationId: number, userId: number) => {
        return await MessageModel.update(
            { isRead: true },
            {
                where: {
                    conversationId,
                    senderId: { [Op.ne]: userId },
                    isRead: false,
                },
            },
        );
    },

    deleteMessage: async (messageId: number) => {
        return await MessageModel.destroy({
            where: { id: messageId },
        });
    },
};

export default messageRepo;
