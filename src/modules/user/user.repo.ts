import { DB } from '@/database';
import {
    rolesList,
    rolesTypes,
    User,
    userStatus,
} from '@/interfaces/user.interfaces';

export const repo = {
    getUserProfile: async (
        userId: string | undefined,
    ): Promise<User | null> => {
        return await DB.User.findOne({ where: { id: userId } });
    },

    getAllUsers: async (): Promise<User[]> => {
        const users = await DB.User.findAll({
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

    userExist: async (userId: number | undefined): Promise<boolean | null> => {
        const user = await DB.User.findOne({ where: { id: userId } });
        return user !== null;
    },

    getUserRoles: async (userId: string | undefined): Promise<rolesList> => {
        const user = await DB.User.findOne({
            where: { id: userId },
            attributes: [],
            include: [
                {
                    model: DB.Role,
                    attributes: ['name'],
                    through: { attributes: [] },
                    as: 'roles',
                },
            ],
        });
        return user?.roles || [];
    },

    setUserRole: async (
        userId: number,
        rolesList: rolesTypes[],
    ): Promise<void | null> => {
        for (const roleId of rolesList) {
            await DB.UserRole.findOrCreate({
                where: { userId, roleId },
            });
        }
    },

    updateStatus: async (
        userId: number,
        status: userStatus,
    ): Promise<void | null> => {
        await DB.User.update(
            { status },
            {
                where: {
                    id: userId,
                },
            },
        );
    },
    getStatus: async (userId: number): Promise<string> => {
        const { status = '' } =
            (await DB.User.findByPk(userId, {
                attributes: ['status'],
            })) || {};
        return status;
    },
};
