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

    updateComment: async (
        commentId: number,
        userId: number,
        content: string,
    ) => {
        if (!commentId || !content) {
            throw new CustomError('Comment ID and content are required.', 400);
        }
        const existingComment = await commentRepo.findCommentById(commentId);
        if (!existingComment) {
            throw new CustomError('Comment not found.', 404);
        }

        if (existingComment.userId !== userId) {
            throw new CustomError('Unauthorized to edit this comment.', 403);
        }

        return await commentRepo.updateComment(commentId, content);
    },
    deleteComment: async (commentId: number, userId: number) => {
        // Check if the comment exists
        const comment = await commentRepo.findCommentById(commentId);
        if (!comment) {
            throw new CustomError('Comment not found', 404);
        }

        // Ensure the user owns the comment before deleting
        if (comment.userId !== userId) {
            throw new CustomError('Unauthorized to delete this comment', 403);
        }

        return await commentRepo.deleteComment(commentId);
    },
};

export default commentService;
