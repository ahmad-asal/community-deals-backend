import { NextFunction, Request, Response } from 'express';
import dealService from './deal.service';
import dealRepo from './deal.repo';
import { CustomError } from '@/utils/custom-error';
import { isValidDealStatus } from '@/interfaces/deal.interface';
import { dealFilters } from './types';
import { rolesTypes } from '@/interfaces/user.interfaces';

export const getDeals = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {
            context: { userId, roles: userRoles } = {},
            query: {
                categoryId,
                status,
                searchQuery,
                createdAt,
                activity,
                intrestedOnly = false,
                authorId,
                type,
            },
        } = req;

        const filters: dealFilters = {
            categoryId: categoryId ? Number(categoryId) : undefined,
            status: status as 'In Review' | 'Approved' | 'Rejected' | undefined,
            query: searchQuery as string | undefined,
            createdAt: createdAt as string | undefined,
            activity: activity as 'active' | 'expired' | undefined,
            intrestedOnly: intrestedOnly as boolean,
            authorId: authorId ? Number(authorId) : undefined,
            type: type as 'I Want to' | 'I Need to' | 'Other' | undefined,
        };

        const isAdmin = userRoles.includes(rolesTypes.admin);

        const response = await dealService.getDeals(userId, filters, isAdmin);

        res.status(200).json({
            message: 'Successfully get Deals',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const addOneController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { context: { userId } = {} } = req;
        const response = await dealService.addOneDeal({
            ...req.body,
            autherId: userId,
        });

        res.status(201).json({
            message: 'deal successfully created',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const getDeal = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {
            context: { userId } = {},
            params: { id },
        } = req;
        const response = await dealService.getOneDeal(Number(id), userId);

        res.status(200).json({
            message: 'Successfully get Deal',
            data: response,
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
        const dealId = req.params.id as unknown as number;
        const { status } = req.body;

        const dealExist = await dealRepo.dealExist(dealId);
        if (!dealExist) {
            throw new CustomError('deal not found', 404);
        }

        if (!isValidDealStatus(status)) {
            throw new CustomError('not supported deal status', 409);
        }

        await dealRepo.updateStatus(dealId, status);

        res.status(201).json({
            message: 'deal status successfully updated',
        });
    } catch (error) {
        next(error);
    }
};
export const updateDeal = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {
            params: { id: dealId },
            context: { userId, roles: userRoles } = {},
        } = req;

        const dealExist = await dealRepo.getOne(parseInt(dealId));

        if (!dealExist) {
            throw new CustomError('deal not found', 404);
        }

        if (
            dealExist.autherId != userId &&
            !userRoles.includes(rolesTypes.admin)
        ) {
            throw new CustomError(
                'You need to have an admin role or to be the auther of the deal',
                403,
            );
        }

        const payload = (({
            title,
            description,
            categoryId,
            expiryDate,
            images,
            type,
            files,
        }) => ({
            title,
            description,
            categoryId,
            expiryDate,
            images,
            type,
            files,
        }))(req.body);

        await dealRepo.updateDeal(parseInt(dealId), payload);

        res.status(201).json({
            message: 'deal data successfully updated',
        });
    } catch (error) {
        next(error);
    }
};
