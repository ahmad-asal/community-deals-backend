import { DB } from '@/database';

export const repo = {
    roleExist: async (roleId: number): Promise<boolean | null> => {
        const user = await DB.Role.findOne({ where: { id: roleId } });
        return user !== null;
    },
};
