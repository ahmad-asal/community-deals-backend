import { NextFunction, Request, Response } from 'express';
import { addOneDeal, filterDeals, getAllDeals } from './deal.service';

export const DealsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const response = await getAllDeals();

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
        const { categoryId, status, searchQuery, createdAt, activity } = req.query;

        // Pass filters to the service function
        const response = await filterDeals({
            categoryId: categoryId ? Number(categoryId) : undefined,
            status: status as 'In Review' | 'Approved' | 'Rejected' | undefined,
            query: searchQuery as string | undefined,
            createdAt: createdAt as string | undefined,
            activity: activity as 'active' | 'expired' | undefined
        });

        res.status(200).json({
            message: 'Successfully fetched filtered Deals',
            data: response || [],
        });
    } catch (error) {
        next(error);
    }
};