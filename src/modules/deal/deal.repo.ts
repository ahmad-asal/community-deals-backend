import { DB } from '@/database';
import { DealModel } from '@/database/models/deal.model';
import { DealImageModel } from '@/database/models/dealImage.model';

const repo = {
    getAll: async (): Promise<DealModel[] | null> => {
        try {
            // Fetch all deals from the Deals table
            const deals = await DB.Deals.findAll({
                include: [
                    {
                        model: DealImageModel,
                        as: 'images', // Match the alias in the association
                    },
                ],
                order: [['id', 'DESC']],
            });
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
        status: 'In Review' | 'Approved' | 'Rejected';
        imageUrls: string[]; // Array of image URLs to associate with the deal
    }): Promise<DealModel | null> => {
        try {
            // Create the deal
            const deal = await DB.Deals.create({
                title: deals_data.title,
                description: deals_data.description,
                categoryId: deals_data.categoryId,
                status: 'In Review',
            });

            // Create the associated image records
            if (deals_data.imageUrls && deals_data.imageUrls.length > 0) {
                const imagePromises = deals_data.imageUrls.map((imageUrl) =>
                    DB.DealImages.create({
                        dealId: deal.id, // Associate with the created deal
                        imageUrl: imageUrl,
                    })
                );
                await Promise.all(imagePromises); // Wait for all image records to be created
            }

            return deal;
        } catch (error) {
            console.error('Error adding deal:', error);
            return null;
        }
    },
};

export default repo;
