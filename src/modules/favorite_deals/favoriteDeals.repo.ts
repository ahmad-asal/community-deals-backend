import { DB } from '@/database';

const repo = {
    setUserFavoriteDeal: async (
        userId: number,
        dealId: number,
    ): Promise<void | null> => {
        const [userRole, created] = await DB.FavoriteDeal.findOrCreate({
            where: { userId, dealId },
        });
    },
};

export default repo;
