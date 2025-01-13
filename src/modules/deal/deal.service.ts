import dealRepo from './deal.repo';
import { CustomError } from '@/utils/custom-error';
import { dealFilters } from './types';

const dealService = {
    getDeals: async (userId: number, filters: dealFilters) => {
        try {
            const deals = await dealRepo.getAll(userId, filters);

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

    getOneDeal: async (id: number) => {
        try {
            const deals = await dealRepo.getOne(id);
            if (!deals) {
                throw new CustomError('No deal found', 404);
            }
            return deals;
        } catch (error) {
            console.error('Error in deal:', error);
            throw new CustomError('Failed to fetch deal', 500);
        }
    },
};
export default dealService;
