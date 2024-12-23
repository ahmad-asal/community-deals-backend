export interface User {
    id?: string;
    email: string;
    name: string;
    username: string;
    password: string;
    created_at: string | undefined;
    updated_at: string | undefined;
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
