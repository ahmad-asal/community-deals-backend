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
        const conversations = await DB.Conversations.findAll({
            where: {
                [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
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

        // Add unread messages count for each conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async conversation => {
                const unreadMessagesCount = await DB.Messages.count({
                    where: {
                        conversationId: conversation.id,
                        senderId: { [Op.ne]: userId }, // Messages not sent by the current user
                        isRead: false,
                    },
                });

                return {
                    ...conversation.toJSON(),
                    unreadMessagesCount,
                };
            }),
        );

        return conversationsWithUnread;
    },

    deleteConversation: async (conversationId: number) => {
        try {
            // Delete all messages in the conversation
            await DB.Messages.destroy({
                where: { conversationId },
            });

            // Delete the conversation itself
            const deleted = await DB.Conversations.destroy({
                where: { id: conversationId },
            });

            if (!deleted) {
                throw new Error('Conversation not found');
            }

            return { success: true, message: 'Conversation deleted' };
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw new Error('Failed to delete conversation');
        }
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
