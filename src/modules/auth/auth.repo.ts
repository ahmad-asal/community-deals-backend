import { DB } from '@/database';
import { User } from '@/interfaces/user.interfaces';

const repo = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        return await DB.User.findOne({
            where: { email },
            include: [
                {
                    model: DB.Role,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    as: 'roles',
                    required: false,
                },
            ],
        });
    },

    createUser: async (userData: User): Promise<User> => {
        return await DB.User.scope('defaultScope').create(userData);
    },
};

export default repo;
