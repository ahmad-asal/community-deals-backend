import { DB } from '@/database';
import { CategoryModel } from '@/database/models';
import { DealModel } from '@/database/models/deal.model';
import { DealImageModel } from '@/database/models/dealImage.model';
import { DealStatuses } from '@/interfaces/deal.interface';
import { Op, Sequelize } from 'sequelize';
const repo = {
    getAll: async (
        userId: number,
        intrestedInOnly: boolean,
    ): Promise<DealModel[] | null> => {
        try {
            // Fetch all deals from the Deals table
            const deals = await DB.Deals.findAll({
                attributes: {
                    include: [
                        [
                            // Subquery to check if the deal is marked as interested by the user
                            Sequelize.literal(`( 
                            SELECT CASE WHEN EXISTS(
                                SELECT *
                                FROM "favorite_deal" AS ufd
                                WHERE ufd."dealId" = "deals"."id" AND ufd."userId" = ${userId}
                            ) THEN 'TRUE' ELSE 'FALSE' END
                          
                            )`),
                            'isInterested',
                        ],
                    ],
                },

                include: [
                    {
                        model: DealImageModel,
                        as: 'images', // Match the alias in the association
                    },
                    {
                        model: DB.User,
                        attributes: [],
                        through: { attributes: [] }, // Join table // where: { userId }

                        where: { id: userId || undefined }, // Filter for specific user if userId is provided
                        as: 'interestedUsers',
                        required: intrestedInOnly, // Only include deals that the user is interested in if userId exists
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
        expiryDate: Date | null;
    }): Promise<DealModel | null> => {
        try {
            // Create the deal
            const deal = await DB.Deals.create({
                title: deals_data.title,
                description: deals_data.description,
                categoryId: deals_data.categoryId,
                status: 'In Review',
                expiryDate: deals_data.expiryDate,
            });

            // Create the associated image records
            if (deals_data.imageUrls && deals_data.imageUrls.length > 0) {
                const imagePromises = deals_data.imageUrls.map(imageUrl =>
                    DB.DealImages.create({
                        dealId: deal.id, // Associate with the created deal
                        imageUrl: imageUrl,
                    }),
                );
                await Promise.all(imagePromises); // Wait for all image records to be created
            }

            return deal;
        } catch (error) {
            console.error('Error adding deal:', error);
            return null;
        }
    },

    filterDeals: async (filters: {
        categoryId?: number;
        status?: 'In Review' | 'Approved' | 'Rejected';
        query?: string;
        createdAt?: string;
        activity?: 'active' | 'expired';
    }): Promise<DealModel[] | null> => {
        try {
            const whereConditions: any = {};

            // Filter by search query (title or description)
            if (filters.query) {
                whereConditions[Op.or] = [
                    { title: { [Op.iLike]: `%${filters.query}%` } },
                    { description: { [Op.iLike]: `%${filters.query}%` } },
                ];
            }

            // Filter by category
            if (filters.categoryId) {
                whereConditions.categoryId = filters.categoryId;
            }

            // Filter by created date range
            if (filters.createdAt) {
                const dateRanges: any = {
                    'last-24-hours': [
                        new Date(new Date().setDate(new Date().getDate() - 1)),
                        new Date(),
                    ],
                    'last-7-days': [
                        new Date(new Date().setDate(new Date().getDate() - 7)),
                        new Date(),
                    ],
                    'last-30-days': [
                        new Date(new Date().setDate(new Date().getDate() - 30)),
                        new Date(),
                    ],
                };
                whereConditions.createdAt = {
                    [Op.between]: dateRanges[filters.createdAt] || [
                        new Date(0),
                        new Date(),
                    ],
                };
            }

            // Filter by status
            if (filters.status) {
                whereConditions.status = filters.status;
            }

            // Filter by activity (active or expired)
            if (filters.activity) {
                if (filters.activity === 'active') {
                    whereConditions.expiryDate = {
                        [Op.or]: [
                            { [Op.is]: null }, // No expiry date means active
                            { [Op.gt]: new Date() }, // Expiry date greater than current date
                        ],
                    };
                } else if (filters.activity === 'expired') {
                    whereConditions.expiryDate = {
                        [Op.lt]: new Date(), // Expiry date less than current date
                    };
                }
            }

            // Fetch filtered deals
            const filteredDeals = await DealModel.findAll({
                where: whereConditions,
                include: [
                    {
                        model: DealImageModel,
                        as: 'images',
                    },
                ],
                order: [['id', 'DESC']],
            });
            return filteredDeals;
        } catch (error) {
            console.error('Error filtering deals:', error);
            throw error;
        }
    },
    getOne: async (id: number): Promise<DealModel | null> => {
        try {
            const deal = await DB.Deals.findOne({
                where: { id }, // Filter by the provided id
                include: [
                    {
                        model: DealImageModel,
                        as: 'images', // Match the alias in the association
                    },
                    {
                        model: CategoryModel,
                        as: 'category',
                        attributes: ['category_name'],
                    },
                ],
            });
            return deal;
        } catch (error) {
            console.error('Error fetching deal by id:', error);
            return null;
        }
    },
    updateStatus: async (
        dealId: number,
        status: DealStatuses,
    ): Promise<void | null> => {
        await DB.Deals.update(
            { status },
            {
                where: {
                    id: dealId,
                },
            },
        );
    },

    dealExist: async (dealId: number | undefined): Promise<boolean | null> => {
        const deal = await DB.Deals.findOne({ where: { id: dealId } });
        return deal !== null;
    },
};

export default repo;
