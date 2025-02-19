import { DB } from '@/database';

/**
 * Repository for interacting with the Comments database.
 */
const commentRepo = {
    /**
     * Creates a new comment in the database.
     */
    createComment: async (dealId: number, userId: number, content: string) => {
        return await DB.Comments.create({ dealId, userId, content });
    },

    /**
     * Fetches all comments for a given deal.
     */
    findCommentsByDeal: async (dealId: number) => {
        return await DB.Comments.findAll({
            where: { dealId },
            include: [
                {
                    model: DB.User,
                    as: 'author',
                    attributes: ['id', 'name', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    },
    findCommentById: async (commentId: number) => {
        return await DB.Comments.findOne({
            where: { id: commentId },
        });
    },
    updateComment: async (commentId: number, content: string) => {
        const [affectedRows] = await DB.Comments.update(
            { content },
            { where: { id: commentId } },
        );

        if (affectedRows === 0) {
            return null;
        }

        return await DB.Comments.findOne({ where: { id: commentId } });
    },
};

export default commentRepo;
