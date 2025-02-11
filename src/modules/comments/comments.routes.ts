import express from 'express';
import { addComment, getCommentsByDeal } from './comments.controller';

const commentsRouter = express.Router();

commentsRouter.post('/', addComment); // Add a comment
commentsRouter.get('/:dealId', getCommentsByDeal); // Get all comments for a deal

export default commentsRouter;
