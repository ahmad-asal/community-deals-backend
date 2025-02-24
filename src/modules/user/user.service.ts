import { repo } from './user.repo';
import { CustomError } from '@/utils/custom-error';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { User } from '@/interfaces/user.interfaces';
import { JwtPayload } from 'jsonwebtoken';

export const getUserProfileService = async (accessToken: string, id?: any) => {
    const decodeToken: JwtPayload = await verifyJWT(
        accessToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    const userId = id || decodeToken.userId;

    const user = await repo.getUserProfile(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    return user;
};
export const getAllUsers = async (accessToken: string): Promise<User[]> => {
    const decodeToken = await verifyJWT(
        accessToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    const userId = decodeToken.userId;

    const users = await repo.getAllUsers();
    // if (!Array.isArray(users)) {
    //     throw new CustomError('User not found', 404);
    // }

    return users;
};
