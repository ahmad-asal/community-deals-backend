import { NextFunction, Request, Response } from 'express';
import * as userService from './user.service';
import { repo } from './user.repo';
import { CustomError } from '@/utils/custom-error';
import { userStatus } from '@/interfaces/user.interfaces';

export const getUserProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userId = req.params.id;
        const accessToken = authorization.split(' ')[1];
        const response = await userService.getUserProfileService(
            accessToken,
            userId,
        );

        res.status(200).json({ message: 'User data fetched', data: response });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const accessToken = authorization.split(' ')[1];
        const response = await userService.getAllUsers(accessToken);

        res.status(200).json({ message: 'User data fetched', data: response });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userId = parseInt(req.params.id);
        const userExist = await repo.userExist(userId);
        if (!userExist) {
            throw new CustomError('User not found', 404);
        } else {
            const status: userStatus = req.body.status;
            await repo.updateStatus(userId, status);
        }

        res.status(200).json({ message: 'User updateted successfully' });
    } catch (error) {
        next(error);
    }
};
