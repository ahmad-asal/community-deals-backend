import commentRepo from './comments.repo';
import dealRepo from '../deal/deal.repo';
import { CustomError } from '@/utils/custom-error';

/**
 * Service to add a new comment.
 */
const commentService = {
    addComment: async (dealId: number, userId: number, content: string) => {
        if (!dealId || !userId || !content) {
            throw new CustomError('All fields are required.', 400);
        }

        const dealExists = await dealRepo.dealExist(dealId);
        if (!dealExists) {
            throw new CustomError('Deal not found.', 404);
        }

        return await commentRepo.createComment(dealId, userId, content);
    },

    /**
     * Service to fetch all comments for a deal.
     */
    getCommentsByDeal: async (dealId: number) => {
        return await commentRepo.findCommentsByDeal(dealId);
    },
};

export default commentService;
