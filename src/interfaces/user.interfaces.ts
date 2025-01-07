import { Deal } from './deal.interface';

export interface User {
    id?: string;
    email: string;
    name: string;
    username: string;
    password: string;
    created_at: string | undefined;
    updated_at: string | undefined;
    status: userStatus;
    roles?: rolesList;
    favoriteDeals?: favoriteDeals;
}

export interface Role {
    id: string;
    name: string;
    created_at: string | undefined;
    updated_at: string | undefined;
}
export type rolesList = Role[];
export type favoriteDeals = Deal[];

export interface UserRole {
    id?: string;
    userId: number;
    roleId: number;
    created_at: string | undefined;
    updated_at: string | undefined;
}

export interface FavoriteDeal {
    id?: string;
    userId: number;
    dealId: number;
    created_at: string | undefined;
    updated_at: string | undefined;
}

export enum rolesTypes {
    user = 1,
    admin = 2,
}

export type userStatus = 'pending' | 'active' | 'suspended';
