import express from 'express';
import {
    addComment,
    deleteComment,
    getCommentsByDeal,
    updateComment,
} from './comments.controller';

const commentsRouter = express.Router();

commentsRouter.post('/', addComment);
commentsRouter.get('/:dealId', getCommentsByDeal);
commentsRouter.put('/:commentId', updateComment);
commentsRouter.delete('/:commentId', deleteComment);

export default commentsRouter;
