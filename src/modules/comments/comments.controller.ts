import { Request, Response, NextFunction } from 'express';
import commentService from './comments.service';

/**
 * Controller to add a new comment.
 */
export const addComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { dealId, userId, content } = req.body;
        const comment = await commentService.addComment(
            dealId,
            userId,
            content,
        );
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get all comments for a deal.
 */
export const getCommentsByDeal = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { dealId } = req.params;
        const comments = await commentService.getCommentsByDeal(Number(dealId));
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

export const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { commentId } = req.params;
        const { userId, content } = req.body;

        if (!content.trim()) {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        const updatedComment = await commentService.updateComment(
            Number(commentId),
            Number(userId),
            content,
        );

        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        return res.status(200).json({
            message: 'Comment updated successfully',
            updatedComment,
        });
    } catch (error) {
        next(error);
    }
};
