import { NextFunction, Request, Response } from 'express';

import dealRepo from '../deal/deal.repo';
import favoriteDealsRepo from '../favorite_deals/favoriteDeals.repo';
import { CustomError } from '@/utils/custom-error';
import { NotificationService } from '@/services/notification.service';
import { UserModel } from '@/database/models/user.model';

const notificationService = new NotificationService();

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

        // Get deal details to find the author
        const deal = await dealRepo.getOne(dealId);
        if (!deal) {
            throw new CustomError('deal not found', 404);
        }

        // Get user details for the notification
        const user = await UserModel.findByPk(userId);
        if (!user) {
            throw new CustomError('user not found', 404);
        }

        await favoriteDealsRepo.setUserFavoriteDeal(userId, dealId, intrest);

        // Send notification only if user is showing interest (intrest is true)
        if (intrest) {
            await notificationService.createNotification(
                deal.autherId, // Send to deal author
                'DEAL_INTEREST',
                `${user.name} is interested in your deal "${deal.title}"`,
                {
                    dealId,
                    dealTitle: deal.title,
                    interestedUserId: userId,
                    interestedUserName: user.name,
                    interestedUserImage: user.profileImg
                }
            );
        }

        res.status(201).json({
            message: 'deal status successfully updated',
        });
    } catch (error) {
        next(error);
    }
};
