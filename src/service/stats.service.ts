import apiClient from "@/api/api-client";
import type { ApiResponse } from "@/model/api";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import type { StatsResult } from "@/model/stats.model";
class StatsService {
    private baseUrl:string = "/stats";
    public async getStats(): Promise<ApiResponse<StatsResult>> {
        try {
            const response = await apiClient.get(this.baseUrl);
            return response.data;
        } catch (error) {
            handleAnyError(error);
            throw error;
        }
    }
}

const statService = new StatsService();
export default statService;