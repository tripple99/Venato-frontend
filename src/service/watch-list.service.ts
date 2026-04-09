import type { ApiResponse,PaginatedApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import { toast } from "sonner";
import type { WatchList } from "@/model/watch-list.model";

class WatchListService {
  private baseUrl: string = "/watch-list";

  /**
   * Adds a specific product to the user's watchlist.
   * @param id Product ID
   */
  public async addToWatchList(id: string): Promise<ApiResponse<WatchList> | undefined> {
    try {
      const response = await apiClient.post<ApiResponse<WatchList>>(`${this.baseUrl}/${id}`);
      toast.success(response.data.message || "Product added to watchlist");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Fetches the authenticated user's entire watchlist.
   * @param params Optional pagination parameters (e.g. { page: 1, limit: 10 })
   */
  public async getWatchList(params?: any): Promise<PaginatedApiResponse<WatchList> | undefined> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<WatchList>>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Removes an item from the watchlist.
   * @param id WatchList record ID
   */
  public async removeFromWatchList(id: string): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
      toast.success(response.data.message || "Product removed from watchlist");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const watchListService = new WatchListService();
export default watchListService;
