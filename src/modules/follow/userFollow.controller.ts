import { NextFunction, Request, Response } from 'express';
import { FollowService } from './userFollow.service';

export class FollowController {
    public followService = new FollowService();

    /**
     * Follow a user
     */
    public followUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { context: { userId } = {} } = req;
            const followerId = userId;
            const followingId = Number(req.params.userId);

            console.log(followerId);
            console.log(followingId);

            const result = await this.followService.followUser(
                followerId,
                followingId,
            );

            res.status(201).json({
                data: result,
                message: 'User followed successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Unfollow a user
     */
    public unfollowUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { context: { userId } = {} } = req;
            const followerId = userId;
            const followingId = Number(req.params.userId);

            await this.followService.unfollowUser(followerId, followingId);

            res.status(200).json({ message: 'User unfollowed successfully' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get followers of a user
     */
    public getFollowers = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = Number(req.params.userId);
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;

            const followers = await this.followService.getFollowers(
                userId,
                limit,
                offset,
            );

            res.status(200).json({
                data: followers,
                message: 'Followers retrieved successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get users that a user is following
     */
    public getFollowing = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = Number(req.params.userId);
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;

            const following = await this.followService.getFollowing(
                userId,
                limit,
                offset,
            );

            res.status(200).json({
                data: following,
                message: 'Following retrieved successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Check if a user is following another user
     */
    public isFollowing = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { context: { userId } = {} } = req;
            const followerId = userId;
            const followingId = Number(req.params.userId);

            const isFollowing = await this.followService.isFollowing(
                followerId,
                followingId,
            );

            res.status(200).json({
                data: { isFollowing },
                message: 'Follow status retrieved successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}
