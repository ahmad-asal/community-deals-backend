// repositories/conversations.repo.ts

import { DB } from '@/database';
import { ConversationModel } from '@/database/models';
import { Op, Sequelize } from 'sequelize';

const conversationRepo = {
    createConversation: async (user1Id: number, user2Id: number) => {
        if (user1Id > user2Id) {
            [user1Id, user2Id] = [user2Id, user1Id];
        }
        let conversation = await ConversationModel.findOne({
            where: {
                [Op.or]: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id },
                ],
            },
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

        if (conversation) {
            return conversation;
        }

        conversation = await ConversationModel.create({ user1Id, user2Id });

        const user1 = await DB.User.findByPk(user1Id, {
            attributes: ['id', 'name', 'profileImg'],
        });
        const user2 = await DB.User.findByPk(user2Id, {
            attributes: ['id', 'name', 'profileImg'],
        });

        return { ...conversation.toJSON(), User1: user1, User2: user2 };
    },

    getConversationBetweenUsers: async (user1Id: number, user2Id: number) => {
        if (user1Id > user2Id) {
            [user1Id, user2Id] = [user2Id, user1Id];
        }

        return await ConversationModel.findOne({
            where: {
                [Op.or]: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id },
                ],
            },
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
    },

    getConversations: async (userId: number) => {
        return await ConversationModel.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
                    },
                    {
                        deletedBy: {
                            [Op.not]: {
                                [Op.contains]: [userId],
                            },
                        },
                    },
                ],
            },
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
            order: [['updatedAt', 'DESC']],
        });
    },

    deleteConversation: async (conversationId: number, userId: number) => {
        const conversation = await ConversationModel.findByPk(conversationId);

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        let deletedBy = conversation.deletedBy || [];

        if (!deletedBy.includes(userId)) {
            deletedBy.push(userId);
        }

        await conversation.update({ deletedBy });

        return conversation;
    },
    unreadMsgsCount: async (userId: number) => {
        try {
            const result = await DB.Messages.findAll({
                attributes: [
                    'conversationId',
                    [
                        Sequelize.fn('COUNT', Sequelize.col('MessageModel.id')),
                        'unreadCount',
                    ],
                ],
                where: {
                    isRead: false, // Only count unread messages
                    senderId: {
                        [Op.ne]: userId, // Exclude messages sent by the user
                    },
                },
                include: [
                    {
                        model: DB.Conversations,
                        as: 'Conversation',
                        where: {
                            [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
                        },
                        attributes: [], // Exclude Conversation columns from SELECT
                    },
                ],
                group: ['MessageModel.conversationId'], // Group by conversationId
            });

            // Return the number of conversations with unread messages
            return result.length;
        } catch (error) {
            console.error('Error counting unread messages:', error);
            throw error;
        }
    },
};

export default conversationRepo;
