import { NextFunction, Request, Response } from 'express';
import { getAllDeals } from './deal.service';

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
