import { DB } from '@/database';
import { CategoryModel } from '@/database/models';
import { DealModel } from '@/database/models/deal.model';
import { DealImageModel } from '@/database/models/dealImage.model';
import { Deal, DealStatuses } from '@/interfaces/deal.interface';
import { Op, Sequelize } from 'sequelize';
import { dealFilters } from './types';
import { omitAndPartial } from '@/utilities';
import { DealFileModel } from '@/database/models/dealFile.model';
const repo = {
    getAll: async (
        userId: number,
        filters: dealFilters,
    ): Promise<DealModel[] | null> => {
        console.log({ filters });

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

        // Filter by user
        if (filters.authorId) {
            whereConditions.autherId = filters.authorId;
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

        // Filter by type
        if (filters.type) {
            whereConditions.type = filters.type;
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
                where: whereConditions,
                include: [
                    {
                        model: DealImageModel,
                        as: 'images', // Match the alias in the association
                    },
                    {
                        model: DealFileModel,
                        as: 'files', // Match the alias in the association
                    },
                    {
                        model: DB.User,
                        attributes: [],
                        through: { attributes: [] }, // Join table // where: { userId }

                        where: { id: userId || undefined }, // Filter for specific user if userId is provided
                        as: 'interestedUsers',
                        required: filters.intrestedOnly, // Only include deals that the user is interested in if userId exists
                    },
                    {
                        model: DB.User,
                        as: 'auther',
                        attributes: {
                            exclude: ['password', 'created_at', 'updated_at'],
                        },
                    },
                    {
                        model: DB.Comments,
                        as: 'comments',
                        include: [
                            {
                                model: DB.User,
                                as: 'author',
                                attributes: [
                                    'id',
                                    'name',
                                    'email',
                                    'profileImg',
                                ],
                            },
                        ],
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
    addOne: async (
        deals_data: Deal & { imageUrls?: string[]; fileUrls?: string[] },
    ): Promise<DealModel | null> => {
        try {
            // Create the deal
            const deal = await DB.Deals.create({
                title: deals_data.title,
                description: deals_data.description,
                categoryId: deals_data.categoryId,
                status: 'In Review',
                expiryDate: deals_data.expiryDate,
                autherId: deals_data.autherId,
                type: deals_data.type,
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

            // Save file URLs
            if (deals_data.fileUrls && deals_data.fileUrls.length > 0) {
                const filePromises = deals_data.fileUrls.map((file: any) =>
                    DB.DealFiles.create({
                        dealId: deal.id,
                        fileUrl: file.url,
                        fileName: file.name,
                        fileType: file.type || null,
                    }),
                );
                await Promise.all(filePromises);
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
            });
            return deal;
        } catch (error) {
            console.error('Error fetching deal by id:', error);
            return null;
        }
    },

    getOnePopulated: async (
        id: number,
        userId: number,
    ): Promise<DealModel | null> => {
        try {
            const deal = await DB.Deals.findOne({
                attributes: {
                    include: [
                        [
                            // Subquery to check if the deal is marked as interested by the user
                            Sequelize.literal(`( 
                            SELECT CASE WHEN EXISTS(
                                SELECT *
                                FROM "favorite_deal" AS ufd
                                WHERE ufd."dealId" = "deals"."id" AND ufd."userId" = ${userId}
                            ) THEN TRUE ELSE FALSE END
                          
                            )`),
                            'isInterested',
                        ],
                    ],
                },
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
                    {
                        model: DB.User,
                        as: 'auther',
                        attributes: {
                            exclude: ['password', 'created_at', 'updated_at'],
                        },
                    },
                    {
                        model: DB.Comments,
                        as: 'comments',
                        include: [
                            {
                                model: DB.User,
                                as: 'author',
                                attributes: [
                                    'id',
                                    'name',
                                    'email',
                                    'profileImg',
                                ],
                            },
                        ],
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
    updateDeal: async (
        dealId: number,
        // payload: Partial<ModelAttributes<DealModel>>,
        {
            images,
            ...payload
        }: omitAndPartial<
            Deal & { images?: object[] },
            'id' | 'created_at' | 'updated_at' | 'status' | 'autherId'
        >,
    ): Promise<void | null> => {
        await DB.Deals.update(payload, {
            where: {
                id: dealId,
            },
        });

        if (images?.length) {
            const imagePromises = images.map(({ imageUrl, status }: any) => {
                if (status === 'added') {
                    DB.DealImages.create({
                        dealId,
                        imageUrl,
                    });
                } else if (status === 'deleted') {
                    DB.DealImages.destroy({
                        where: { imageUrl, dealId },
                    });
                }
            });
            await Promise.all(imagePromises); // Wait for all image records to be created
        }
    },

    dealExist: async (dealId: number | undefined): Promise<boolean | null> => {
        const deal = await DB.Deals.findOne({ where: { id: dealId } });
        return deal !== null;
    },

    findUserDeals: async (userId: number): Promise<DealModel[] | null> => {
        const deals: DealModel[] = await DB.Deals.findAll({
            where: { autherId: userId },
        });

        return deals;
    },
};

export default repo;
