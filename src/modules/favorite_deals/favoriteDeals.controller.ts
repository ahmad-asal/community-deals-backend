import { NextFunction, Request, Response } from 'express';

import dealRepo from '../deal/deal.repo';
import favoriteDealsRepo from '../favorite_deals/favoriteDeals.repo';
import { CustomError } from '@/utils/custom-error';

export const updateIntrest = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        // const dealId = req.params.id as unknown as number;
        const { dealId, intrest } = req.body;
        const { context: { userId } = {} } = req;

        const dealExist = await dealRepo.dealExist(dealId);
        if (!dealExist) {
            throw new CustomError('deal not found', 404);
        }
        if (!(typeof intrest === 'boolean')) {
            throw new CustomError('intrest should be boolean', 409);
        }
        await favoriteDealsRepo.setUserFavoriteDeal(userId, dealId, intrest);

        res.status(201).json({
            message: 'deal status successfully updated',
        });
    } catch (error) {
        next(error);
    }
};
