import { NextFunction, Request, Response } from 'express';
import { addOneDeal, getAllDeals } from './deal.service';

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

