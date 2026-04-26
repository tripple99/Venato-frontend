import type { IUserStats } from "@/pages/SuperAdmin/columns/audit-log-hooks";

export interface ApiResponse<T> {
    status: string;
    message: string;
    payload: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    stats?: IUserStats;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;