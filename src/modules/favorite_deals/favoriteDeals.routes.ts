import express from 'express';
import { updateIntrest } from './favoriteDeals.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const FavoriteDealRouter = express.Router();

FavoriteDealRouter.post('/updateIntrest', authMiddleware, updateIntrest);

export default FavoriteDealRouter;
