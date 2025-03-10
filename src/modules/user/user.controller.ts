import { NextFunction, Request, Response } from 'express';
import * as userService from './user.service';
import dealsService from '../deal/deal.service';
import { repo as userRepo } from './user.repo';
import { repo as roleRepo } from '../role/role.repo';

import { CustomError } from '@/utils/custom-error';
import {
    possibleUserStatuses,
    rolesTypes,
    userStatus,
} from '@/interfaces/user.interfaces';

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
        const response = await userService.getAllUsers();
        res.status(200).json({ message: 'User data fetched', data: response });
    } catch (error) {
        next(error);
    }
};

export const getUsersByStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const users = await userService.getAllUsers();

        const {
            query: { status },
        } = req;

        let filterStatus: any = possibleUserStatuses;
        if (status) {
            filterStatus = status;
        }

        const matchingUsers = users.filter(user =>
            filterStatus.includes(user.status),
        );

        res.status(200).json({
            message: 'users were fetched',
            data: matchingUsers,
        });
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
        const userId = parseInt(req.params.id);
        const userExist = await userRepo.userExist(userId);
        if (!userExist) {
            throw new CustomError('User not found', 404);
        } else {
            const status: userStatus = req.body.status;
            await userRepo.updateStatus(userId, status);
        }

        res.status(200).json({ message: 'User status updated successfully' });
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
        const userId = parseInt(req.params.id);
        const userExist = await userRepo.userExist(userId);
        if (!userExist) {
            throw new CustomError('User not found', 404);
        }

        const status = await userRepo.getStatus(userId);
        if (status != 'active') {
            throw new CustomError('User is not active', 409);
        }
        const { roles: rolesList } = req.body;
        for (const roleId of rolesList) {
            const roleExists = await roleRepo.roleExist(roleId);
            if (!roleExists) {
                throw new CustomError(
                    'some of the roles are not assignable',
                    409,
                );
            }
        }

        await userRepo.setUserRole(userId, rolesList);
        return res
            .status(200)
            .json({ message: 'User roles updateted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getUserDeals = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = Number(req.params.id);

        const response = await dealsService.getUserDeals(userId);

        res.status(200).json({
            message: 'Successfully get Deals',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserData = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {
            params: { id },
            context: { roles: userRoles } = {},
        } = req;
        const userId = parseInt(id); // Extract `id` from route params and convert to number

        const userExist = await userRepo.getOne(userId);

        if (!userExist) {
            throw new CustomError('user not found', 404);
        }

        if (userExist.id != id && !userRoles.includes(rolesTypes.admin)) {
            throw new CustomError(
                'You need to have an admin role or to be the same user',
                403,
            );
        }

        const payload = (({
            address,
            companyName,
            jobTitle,
            name,
            phoneNumber,
            profileImg,
        }) => ({
            address,
            companyName,
            jobTitle,
            name,
            phoneNumber,
            profileImg,
        }))(req.body);

        await userRepo.updateUserData(parseInt(id), payload);

        res.status(201).json({
            message: 'user data successfully updated',
        });
    } catch (error) {
        next(error);
    }
};

export const getStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { context: { roles: userRoles } = {} } = req;
        if (!userRoles.includes(rolesTypes.admin)) {
            throw new CustomError('You need to have an admin role ', 403);
        }
        const statistics = await userService.getStatisticsService();
        res.json(statistics);
    } catch (error) {
        next(error);
    }
};
