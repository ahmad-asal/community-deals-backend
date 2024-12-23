import express from 'express';
import { getAll, getUserProfileController } from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.get('/profile/:id?', authMiddleware, getUserProfileController);
userRouter.get('/all', authMiddleware, getAll);

export default userRouter;
