import express from 'express';
import {
    updateStatus,
    getAll,
    getUserProfileController,
    updateRoles,
    getUserDeals,
    updateUserData,
    getUsersByStatus,
    getStatistics,
} from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { rolesTypes } from '@/interfaces/user.interfaces';
import { authorizeRole } from '@/middlewares/authorizeRole';
import { FollowController } from '@/modules/follow/userFollow.controller';

const userRouter = express.Router();
const followController = new FollowController();

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
    authorizeRole([rolesTypes.user, rolesTypes.admin]),
    getUsersByStatus,
);
userRouter.get(
    '/statistics',
    authMiddleware,
    authorizeRole([rolesTypes.admin]),
    getStatistics,
);

// Follow routes
userRouter.post('/:userId/follow', authMiddleware, followController.followUser);
userRouter.delete(
    '/:userId/follow',
    authMiddleware,
    followController.unfollowUser,
);
userRouter.get('/:userId/followers', followController.getFollowers);
userRouter.get('/:userId/following', followController.getFollowing);
userRouter.get(
    '/:userId/is-following',
    authMiddleware,
    followController.isFollowing,
);
userRouter.get(
    '/not-following',
    authMiddleware,
    followController.getNotFollowingUsers,
);

export default userRouter;
