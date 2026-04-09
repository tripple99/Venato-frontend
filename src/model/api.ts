export interface ApiResponse<T> {
    status: string;
    message: string;
    payload: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;