import { DB } from '@/database';

const repo = {
    create: async (userId: number, roleId: number): Promise<boolean | null> => {
        const user = await DB.UserRole.findOrCreate({
            where: { userId, roleId },
        });

        return user !== null;
    },
};
export default repo;
