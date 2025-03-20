import { CustomError } from '@/utils/custom-error';
import conversationRepo from './conversation.repo';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const conversationService = {
    createConversation: async (user1Id: number, user2Id: number) => {
        if (!user1Id || !user2Id) {
            throw new CustomError('Both user IDs are required.', 400);
        }
        if (user1Id > user2Id) {
            [user1Id, user2Id] = [user2Id, user1Id];
        }

        const existingConversation =
            await conversationRepo.getConversationBetweenUsers(
                user1Id,
                user2Id,
            );

        if (existingConversation) {
            return existingConversation;
        }

        return await conversationRepo.createConversation(user1Id, user2Id);
    },

    getConversations: async (userId: number) => {
        if (!userId) {
            throw new CustomError('User ID is required.', 400);
        }

        return await conversationRepo.getConversations(userId);
    },

    deleteConversation: async (conversationId: number, accessToken: string) => {
        const decodeToken: JwtPayload = await verifyJWT(
            accessToken,
            JWT_ACCESS_TOKEN_SECRET as string,
        );

        const userId = decodeToken.userId;

        if (!conversationId || !userId) {
            throw new CustomError(
                'Conversation ID and User ID are required.',
                400,
            );
        }

        return await conversationRepo.deleteConversation(
            conversationId,
            userId,
        );
    },
    unreadMsgsCount: async (accessToken: string) => {
        const decodeToken: JwtPayload = await verifyJWT(
            accessToken,
            JWT_ACCESS_TOKEN_SECRET as string,
        );

        const userId = decodeToken.userId;

        if (!userId) {
            throw new CustomError('User ID is required.', 400);
        }

        return await conversationRepo.unreadMsgsCount(userId);
    },
};

export default conversationService;
