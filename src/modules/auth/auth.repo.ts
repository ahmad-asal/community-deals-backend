import { DB } from '@/database';
import { User } from '@/interfaces/user.interfaces';

const repo = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        return await DB.Users.findOne({ where: { email } });
    },

    createUser: async (userData: User): Promise<User> => {
        return await DB.Users.scope('defaultScope').create(userData);
    },
};

export default repo;
