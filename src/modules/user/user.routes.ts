import express from 'express';
import {
    updateStatus,
    getAll,
    getUserProfileController,
} from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { rolesTypes } from '@/interfaces/user.interfaces';
import { authorizeRole } from '@/middlewares/authorizeRole';

const userRouter = express.Router();

userRouter.get('/profile/:id?', authMiddleware, getUserProfileController);
userRouter.get('/all', authMiddleware, getAll);
userRouter.put(
    '/:id/updatestatus',
    authMiddleware,
    authorizeRole([rolesTypes.admin]),
    updateStatus,
);

export default userRouter;
