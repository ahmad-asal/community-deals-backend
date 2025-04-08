import dealRepo from './deal.repo';
import { CustomError } from '@/utils/custom-error';
import { dealFilters } from './types';

const dealService = {
    getDeals: async (
        userId: number,
        filters: dealFilters,
        isAdmin: boolean,
    ) => {
        try {
            const deals = await dealRepo.getAll(userId, filters, isAdmin);

            if (!deals) {
                throw new CustomError('No deals found', 404);
            }
            return deals;
        } catch (error) {
            console.error('Error in deals:', error);
            throw new CustomError('Failed to fetch deals', 500);
        }
    },
    addOneDeal: async (DealsData: any) => {
        try {
            const newDeal = await dealRepo.addOne(DealsData);
            return newDeal;
        } catch (error) {
            console.error('Error adding deal:', error);
            throw new CustomError('Failed to add a deal', 500);
        }
    },

    getOneDeal: async (id: number, userId: number) => {
        try {
            const deals = await dealRepo.getOnePopulated(id, userId);
            if (!deals) {
                throw new CustomError('No deal found', 404);
            }
            return deals;
        } catch (error) {
            console.error('Error in deal:', error);
            throw new CustomError('Failed to fetch deal', 500);
        }
    },

    getUserDeals: async (userId: number) => {
        try {
            const deals = await dealRepo.findUserDeals(userId);
            if (!deals) {
                throw new CustomError('No deals found', 404);
            }
            return deals;
        } catch (error) {
            console.error('Error in deal:', error);
            throw new CustomError('Failed to fetch deal', 500);
        }
    },
};
export default dealService;
