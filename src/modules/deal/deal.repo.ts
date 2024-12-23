import { DB } from '@/database';
import { DealModel } from '@/database/models/deal.model';

const repo = {
    getAll: async (): Promise<DealModel[] | null> => {
        try {
            // Fetch all deals from the Deals table
            const deals = await DB.Deals.findAll();
            return deals;
        } catch (error) {
            console.error('Error fetching deals:', error);
            return null;
        }
    },
    findByName: async (title: string): Promise<DealModel | null> => {
        return await DB.Deals.findOne({
            where: { title: title },
        });
    },
    addOne: async (deals_data: {
        title: string;
        description: string;
        categoryId: number;
        status: 'In Review' | 'Approved' | 'rejected';
    }): Promise<DealModel> => {
        return await DB.Deals.create(deals_data);
    },
};

export default repo;
