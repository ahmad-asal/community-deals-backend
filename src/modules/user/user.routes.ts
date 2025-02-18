import express from 'express';
import {
    updateStatus,
    getAll,
    getUserProfileController,
    updateRoles,
    getUserDeals,
    updateUserData,
    getUsersByStatus,
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
userRouter.put(
    '/:id/updateRoles',
    authMiddleware,
    authorizeRole([rolesTypes.admin]),
    updateRoles,
);
userRouter.get('/:id/deals', authMiddleware, getUserDeals);
userRouter.put(
    '/:id/updateUserData',
    authMiddleware,
    authorizeRole([rolesTypes.user, rolesTypes.admin]),
    updateUserData,
);
userRouter.get(
    '/usersByStatus',
    authMiddleware,
    // authorizeRole([rolesTypes.user, rolesTypes.admin]),
    getUsersByStatus,
);

export default userRouter;
