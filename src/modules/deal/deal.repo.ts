import { DB } from '@/database';
import { CategoryModel } from '@/database/models';
import { DealModel } from '@/database/models/deal.model';
import { DealImageModel } from '@/database/models/dealImage.model';
import { Deal, DealStatuses } from '@/interfaces/deal.interface';
import { Op, Sequelize } from 'sequelize';
import { dealFilters } from './types';
import { omitAndPartial } from '@/utilities';
import { DealFileModel } from '@/database/models/dealFile.model';
import { CustomAudienceModel } from '@/database/models/customAudience.model';
const repo = {
    getAll: async (
        userId: number,
        filters: dealFilters,
        clientCountry?: any,
        isAdmin?: boolean,
    ): Promise<DealModel[] | null> => {
        console.log({ filters });
        let clientCountryRequest = clientCountry;

        const whereConditions: any = {};

        if (filters.status === 'In Review' && !isAdmin) {
            filters.authorId = userId;
        }

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
            clientCountryRequest = null;
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

        if (filters.intrestedOnly) {
            clientCountryRequest = null;
        }

        // If no countries are passed in the filter, use the clientCountry parameter

        if (
            (!filters.countries || filters.countries.length === 0) &&
            !isAdmin
        ) {
            if (clientCountryRequest) {
                whereConditions[Op.or] = [
                    { '$cities.country$': { [Op.in]: [clientCountryRequest] } }, // Apply clientCountryRequest if it's defined
                    { '$cities.country$': { [Op.is]: null } }, // Include deals with no country
                ];
            }
        } else if (filters?.countries?.length > 0) {
            // If countries are provided in the filters, apply that condition
            whereConditions[Op.or] = [
                { '$cities.country$': { [Op.in]: filters.countries } }, // Deals in selected countries
                { '$cities.country$': { [Op.is]: null } }, // Deals with no country
            ];
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
                    {
                        model: DB.Cities,
                        attributes: ['id', 'name', 'country'],
                        through: { attributes: [] },
                        as: 'cities',
                        required: false,
                    },
                ],
                order: [['id', 'DESC']],
            });

            // **Skip audience filtering if the user is an admin**
            if (isAdmin) {
                return deals;
            }

            // Filter deals based on audience type
            const filteredDeals = await Promise.all(
                deals.map(async (deal: any) => {
                    if (
                        deal.audience === 'public' ||
                        deal.auther.id === userId
                    ) {
                        return deal; // Everyone can see
                    }

                    if (deal.audience === 'friends') {
                        const isFollowing = await DB.UserFollowModel.findOne({
                            where: {
                                followerId: userId, // Logged-in user
                                followingId: deal.auther.id, // Deal creator
                            },
                        });
                        return isFollowing ? deal : null; // Only followers can see
                    }

                    if (deal.audience === 'custom') {
                        const isAuthorized = await CustomAudienceModel.findOne({
                            where: {
                                dealId: deal.id,
                                userId: userId,
                            },
                        });
                        return isAuthorized ? deal : null; // Only selected users can see
                    }

                    return null; // Hide the deal if no conditions are met
                }),
            );

            return filteredDeals.filter(Boolean); // Remove `null` values
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
        deals_data: Deal & {
            imageUrls?: string[];
            audienceUserIds?: number[];
            fileUrls?: string[];
            countries?: string[];
        },
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
                audience: deals_data.audience,
            });
            console.log('deals_data', deals_data);

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

            // Fetch city IDs based on country names
            if (deals_data?.countries?.length) {
                console.log('deals_data.countries', deals_data.countries);

                const cities = await DB.Cities.findAll({
                    where: { name: { [Op.in]: deals_data.countries } },
                    attributes: ['id'],
                });

                const cityIds = cities.map(city => city.id);

                // Associate deal with the retrieved city IDs
                if (cityIds.length > 0) {
                    await Promise.all(
                        cityIds.map(cityId =>
                            DB.DealCities.create({ dealId: deal.id, cityId }),
                        ),
                    );
                }
            }
            // Handle custom audience
            if (
                deals_data.audience === 'custom' &&
                deals_data.audienceUserIds?.length
            ) {
                const audiencePromises = deals_data.audienceUserIds.map(
                    userId =>
                        CustomAudienceModel.create({
                            userId,
                            dealId: deal.id,
                        }),
                );
                await Promise.all(audiencePromises);
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
                        model: DealFileModel,
                        as: 'files', // Match the alias in the association
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
                    {
                        model: DB.Cities,
                        attributes: ['id', 'name', 'country'],
                        through: { attributes: [] },
                        as: 'cities',
                        required: false,
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
        {
            images,
            files,
            countries,
            ...payload
        }: omitAndPartial<
            Deal & { images?: object[]; files?: object[]; countries?: any },
            'id' | 'created_at' | 'updated_at' | 'status' | 'autherId'
        >,
    ): Promise<void | null> => {
        // 1. Update deal basic info
        await DB.Deals.update(payload, {
            where: { id: dealId },
        });

        // 2. Handle images
        if (images?.length) {
            const imagePromises = images.map(
                async ({ imageUrl, status }: any) => {
                    if (status === 'added') {
                        // Check if image already exists to avoid duplicate
                        const existingImage = await DB.DealImages.findOne({
                            where: { dealId, imageUrl },
                        });

                        if (!existingImage) {
                            await DB.DealImages.create({ dealId, imageUrl });
                        }
                    } else if (status === 'deleted') {
                        await DB.DealImages.destroy({
                            where: { dealId, imageUrl },
                        });
                    }
                },
            );

            await Promise.all(imagePromises);
        }

        // 3. Handle files
        if (files?.length) {
            const filePromises = files.map(
                async ({ fileUrl, status, fileName }: any) => {
                    if (status === 'added') {
                        const existingFile = await DB.DealFiles.findOne({
                            where: { dealId, fileUrl },
                        });

                        if (!existingFile) {
                            await DB.DealFiles.create({
                                dealId,
                                fileUrl,
                                fileName,
                            });
                        }
                    } else if (status === 'deleted') {
                        await DB.DealFiles.destroy({
                            where: { dealId, fileUrl },
                        });
                    }
                },
            );

            await Promise.all(filePromises);
        }

        // 4. Handle countries
        if (countries?.length) {
            const cities = await DB.Cities.findAll({
                where: { name: { [Op.in]: countries } },
                attributes: ['id'],
            });

            const cityIds = cities.map(city => city.id);

            if (cityIds.length > 0) {
                // Step 1: Get existing links
                const existingLinks = await DB.DealCities.findAll({
                    where: {
                        dealId,
                        cityId: { [Op.in]: cityIds },
                    },
                    attributes: ['cityId'],
                });

                const existingCityIds = existingLinks.map(link => link.cityId);

                // Step 2: Only insert new ones
                const newCityIds = cityIds.filter(
                    cityId => !existingCityIds.includes(cityId),
                );

                if (newCityIds.length > 0) {
                    await DB.DealCities.bulkCreate(
                        newCityIds.map(cityId => ({
                            dealId,
                            cityId,
                        })),
                    );
                }
            }
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
