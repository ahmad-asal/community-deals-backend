import repo from './deal.repo';
import { CustomError } from '@/utils/custom-error';

export const getAllDeals = async () => {
    try {
        const deals = await repo.getAll();

        if (!deals) {
            throw new CustomError('No deals found', 404);
        }
        return deals;
    } catch (error) {
        console.error('Error in deals:', error);
        throw new CustomError('Failed to fetch deals', 500);
    }
};
