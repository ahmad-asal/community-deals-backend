import { DB } from '@/database';
import { User } from '@/interfaces/user.interfaces';

export const repo = {
    getUserProfile: async (
        userId: string | undefined,
    ): Promise<User | null> => {
        return await DB.User.findOne({ where: { id: userId } });
    },

    getAllUsers: async (): Promise<User[]> => {
        const users = await DB.User.findAll({
            // raw: true, // the cause duplication of  the many side
            // plain: true,
            include: [
                {
                    model: DB.Role,
                    attributes: ['name'],
                    through: { attributes: [] },
                    as: 'roles',
                    required: false,
                },
            ],
        });
        return users;
    },
};
