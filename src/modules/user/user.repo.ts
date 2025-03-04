import { DB } from '@/database';
import { UserModel } from '@/database/models/user.model';
import {
    rolesList,
    rolesTypes,
    User,
    userStatus,
} from '@/interfaces/user.interfaces';
import { Sequelize } from 'sequelize';

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

    getOne: async (id: number): Promise<UserModel | null> => {
        try {
            const user = await DB.User.findOne({
                where: { id }, // Filter by the provided id
            });
            return user;
        } catch (error) {
            console.error('Error fetching user by id:', error);
            return null;
        }
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
    updateUserData: async (
        userId: number,
        payload: {
            address: string;
            companyName: string;
            jobTitle: string;
            name: string;
            phoneNumber: string;
            profileImg: string;
        },
    ): Promise<void | null> => {
        await DB.User.update(payload, {
            where: {
                id: userId,
            },
        });
    },
    async getDealsByStatus() {
        return await DB.Deals.findAll({
            attributes: [
                'status',
                [Sequelize.fn('COUNT', Sequelize.col('status')), 'count'],
            ],
            group: ['status'],
            raw: true,
        });
    },

    async getUsersByStatus() {
        return await UserModel.findAll({
            attributes: [
                'status',
                [Sequelize.fn('COUNT', Sequelize.col('status')), 'count'],
            ],
            group: ['status'],
            raw: true,
        });
    },
};
