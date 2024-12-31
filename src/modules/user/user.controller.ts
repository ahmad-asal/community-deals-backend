import { NextFunction, Request, Response } from 'express';
import * as userService from './user.service';
import { repo as userRepo } from './user.repo';
import { repo as roleRepo } from '../role/role.repo';

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
        const userExist = await userRepo.userExist(userId);
        if (!userExist) {
            throw new CustomError('User not found', 404);
        } else {
            const status: userStatus = req.body.status;
            await userRepo.updateStatus(userId, status);
        }

        res.status(200).json({ message: 'User updateted successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateRoles = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userId = parseInt(req.params.id);
        const userExist = await userRepo.userExist(userId);
        if (!userExist) {
            throw new CustomError('User not found', 404);
        }

        const status = await userRepo.getStatus(userId);
        if (status != '882') {
            console.log('-------------------');
            console.log(status);
            return res.json({ status });
        }
        const { rolesList } = req.body;
        for (const roleId of rolesList) {
            const roleExists = await roleRepo.roleExist(roleId);
            if (!roleExists) {
                throw new CustomError('some of the roles does not exist', 404);
            }
        }

        await userRepo.setUserRole(userId, rolesList);
        return res.status(200).json({ message: 'User updateted successfully' });
    } catch (error) {
        next(error);
    }
};
