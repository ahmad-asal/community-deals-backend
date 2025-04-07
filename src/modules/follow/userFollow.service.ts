import { UserFollowModel } from '@/database/models/UserFollow.model';
import { UserModel } from '@/database/models/user.model';

export class FollowService {
    public userFollowModel = UserFollowModel;
    public userModel = UserModel;

    /**
     * Follow a user
     */
    public async followUser(
        followerId: number,
        followingId: number,
    ): Promise<UserFollowModel> {
        // Check if users exist
        const follower = await this.userModel.findByPk(followerId);
        const following = await this.userModel.findByPk(followingId);

        // if (!follower || !following) {
        //     throw new HttpException(404, 'User not found');
        // }

        console.log('follower >');

        // Check if already following
        const existingFollow = await this.userFollowModel.findOne({
            where: { followerId, followingId },
        });

        console.log('existingFollow >');
        console.log(existingFollow);

        // if (existingFollow) {
        //     throw new HttpException(409, 'Already following this user');
        // }

        // Create new follow relationship
        const follow = await this.userFollowModel.create({
            followerId,
            followingId,
        });

        return follow;
    }

    /**
     * Unfollow a user
     */
    public async unfollowUser(
        followerId: number,
        followingId: number,
    ): Promise<boolean> {
        // Check if users exist
        const follower = await this.userModel.findByPk(followerId);
        const following = await this.userModel.findByPk(followingId);

        // if (!follower || !following) {
        //     throw new HttpException(404, 'User not found');
        // }

        // Check if following
        const existingFollow = await this.userFollowModel.findOne({
            where: { followerId, followingId },
        });

        // if (!existingFollow) {
        //     throw new HttpException(404, 'Not following this user');
        // }

        // Delete follow relationship
        await existingFollow.destroy();
        return true;
    }

    /**
     * Get followers of a user
     */
    public async getFollowers(
        userId: number,
        limit = 10,
        offset = 0,
    ): Promise<{ count: number; rows: UserModel[] }> {
        const user = await this.userModel.findByPk(userId);
        // if (!user) {
        //     throw new HttpException(404, 'User not found');
        // }

        return await this.userModel.findAndCountAll({
            include: [
                {
                    model: this.userModel,
                    as: 'followers',
                    where: { id: userId },
                    attributes: [],
                },
            ],
            // limit,
            // offset,
        });
    }

    /**
     * Get users that a user is following
     */
    public async getFollowing(
        userId: number,
        limit = 10,
        offset = 0,
    ): Promise<{ count: number; rows: UserModel[] }> {
        const user = await this.userModel.findByPk(userId);
        // if (!user) {
        //     throw new HttpException(404, 'User not found');
        // }

        return await this.userModel.findAndCountAll({
            include: [
                {
                    model: this.userModel,
                    as: 'following',
                    where: { id: userId },
                    attributes: [],
                },
            ],
            // limit,
            // offset,
        });
    }

    /**
     * Check if a user is following another user
     */
    public async isFollowing(
        followerId: number,
        followingId: number,
    ): Promise<boolean> {
        const follow = await this.userFollowModel.findOne({
            where: { followerId, followingId },
        });

        return !!follow;
    }
}
