import express from 'express';
import { addComment, getCommentsByDeal } from './comments.controller';

const commentsRouter = express.Router();

commentsRouter.post('/', addComment);
commentsRouter.get('/:dealId', getCommentsByDeal);

export default commentsRouter;
