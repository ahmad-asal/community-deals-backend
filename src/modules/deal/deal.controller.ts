import { NextFunction, Request, Response } from 'express';
import {
    addOneDeal,
    filterDeals,
    getAllDeals,
    getOneDeal,
} from './deal.service';
import dealRepo from './deal.repo';
import { CustomError } from '@/utils/custom-error';
import { isValidDealStatus } from '@/interfaces/deal.interface';

export const DealsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { context: { userId } = {} } = req;
        const response = await getAllDeals(userId);

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
        const response = await addOneDeal(req.body);

        res.status(201).json({
            message: 'deal successfully created',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const filterDealsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        // Extract filters from query parameters
        const { categoryId, status, searchQuery, createdAt, activity } =
            req.query;

        // Pass filters to the service function
        const response = await filterDeals({
            categoryId: categoryId ? Number(categoryId) : undefined,
            status: status as 'In Review' | 'Approved' | 'Rejected' | undefined,
            query: searchQuery as string | undefined,
            createdAt: createdAt as string | undefined,
            activity: activity as 'active' | 'expired' | undefined,
        });

        res.status(200).json({
            message: 'Successfully fetched filtered Deals',
            data: response || [],
        });
    } catch (error) {
        next(error);
    }
};

export const getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id: any = req.params.id;
        const response = await getOneDeal(id);

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
