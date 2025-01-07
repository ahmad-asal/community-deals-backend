import { DB } from '@/database';

const repo = {
    setUserFavoriteDeal: async (
        userId: number,
        dealId: number,
        intrest: boolean,
    ): Promise<void | null> => {
        if (intrest) {
            await DB.FavoriteDeal.findOrCreate({
                where: { userId, dealId },
            });
        } else {
            await DB.FavoriteDeal.destroy({
                where: { userId, dealId },
            });
        }
    },
};

export default repo;
