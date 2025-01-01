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

export const addOneDeal = async (DealsData: any) => {
    try {
        const newDeal = await repo.addOne(DealsData);
        return newDeal;
    } catch (error) {
        console.error('Error adding deal:', error);
        throw new CustomError('Failed to add a deal', 500);
    }
};

export const filterDeals = async (filters: {
    categoryId?: number;
    status?: 'In Review' | 'Approved' | 'Rejected';
    query?: string;
    createdAt?: string;
    activity?: 'active' | 'expired';
}) => {
    try {
        const filteredDeals = await repo.filterDeals(filters);
        return filteredDeals;
    } catch (error) {
        console.error('Error filtering deals:', error);
        throw new CustomError('Failed to filter deals', 500);
    }
};

