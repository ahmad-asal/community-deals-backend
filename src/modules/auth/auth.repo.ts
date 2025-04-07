import { DB } from '@/database';
import { User } from '@/interfaces/user.interfaces';

const repo = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        try {
            console.log('Attempting to connect to database');
            const user = await DB.User.findOne({
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
            console.log(
                'Database query result:',
                user ? 'User found' : 'User not found',
            );
            return user;
            // Rest of your code
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Handle error
        }
        return null;
    },

    createUser: async (userData: User): Promise<User> => {
        return await DB.User.scope('defaultScope').create(userData);
    },
};

export default repo;
