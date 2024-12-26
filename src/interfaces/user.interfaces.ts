export interface User {
    roles: any;
    id?: string;
    email: string;
    name: string;
    username: string;
    password: string;
    created_at: string | undefined;
    updated_at: string | undefined;
    status: userStatus;
}

export interface Role {
    id?: string;
    name: string;
    created_at: string | undefined;
    updated_at: string | undefined;
}

export interface UserRole {
    id?: string;
    userId: number;
    roleId: number;
    created_at: string | undefined;
    updated_at: string | undefined;
}

export type rolesList = {
    roles: [name: string];
};

export enum rolesTypes {
    user = 1,
    admin = 2,
}

export type userStatus = 'pending' | 'active' | 'suspended';
