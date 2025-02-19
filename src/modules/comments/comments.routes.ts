import express from 'express';
import {
    addComment,
    getCommentsByDeal,
    updateComment,
} from './comments.controller';

const commentsRouter = express.Router();

commentsRouter.post('/', addComment);
commentsRouter.get('/:dealId', getCommentsByDeal);
commentsRouter.put('/:commentId', updateComment);

export default commentsRouter;
