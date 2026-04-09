import type { ApiResponse,PaginatedApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import { toast } from "sonner";
import type { IMarketData } from "@/model/market.model";

class MarketService {
  private baseUrl: string = "/markets";

  /**
   * Fetches markets available for public view.
   * @param query Optional query parameters for pagination, sorting, or searching
   */
  public async getPublicMarkets(query?: any): Promise<ApiResponse<IMarketData[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<IMarketData[]>>(`${this.baseUrl}/public`, { params: query });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * (Super Admin) Fetches all markets including internal/inactive ones.
   * @param query Optional query parameters
   */
  public async getAllMarkets(query?: any): Promise<PaginatedApiResponse<IMarketData> | undefined> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<IMarketData>>(this.baseUrl, { params: query });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * (Super Admin) Fetches details for a single market by ID.
   * @param id Market ID
   */
  public async getMarketById(id: string): Promise<ApiResponse<IMarketData> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<IMarketData>>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * (Super Admin) Creates a new market.
   * @param payload Market data matching IMarketData schema
   */
  public async createMarket(payload: IMarketData): Promise<ApiResponse<IMarketData> | undefined> {
    try {
      const response = await apiClient.post<ApiResponse<IMarketData>>(this.baseUrl, payload);
      toast.success(response.data.message || "Market created successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * (Super Admin) Updates existing market details.
   * @param id Market ID
   * @param payload Partial updates for a market
   */
  public async updateMarket(id: string, payload: Partial<IMarketData>): Promise<ApiResponse<IMarketData> | undefined> {
    try {
      const response = await apiClient.patch<ApiResponse<IMarketData>>(`${this.baseUrl}/${id}`, payload);
      toast.success(response.data.message || "Market updated successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * (Super Admin) Performs a soft or hard delete of a market.
   * @param id Market ID
   */
  public async deleteMarket(id: string): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
      toast.success(response.data.message || "Market deleted successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const marketService = new MarketService();
export default marketService;
