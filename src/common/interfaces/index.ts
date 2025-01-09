export interface User {
    id: number;
    username: string;
    password: string;
    role: 'admin' | 'editor' | 'viewer';
}

export interface Document {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IngestionProcess {
    id: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    startedAt: Date;
    finishedAt?: Date;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface UserRoleUpdate {
    userId: number;
    newRole: 'admin' | 'editor' | 'viewer';
}