import type { ApiResponse ,PaginatedApiResponse} from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import { toast } from "sonner";
import type { Alert, PriceTrendBucket, ThresholdSuggestions } from "@/model/alert.model";

class AlertService {
  private baseUrl: string = "/alerts";

  /**
   * Fetches all alerts for the current user.
   */
  public async getAlerts(params?: any): Promise<PaginatedApiResponse<Alert> | undefined> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<Alert>>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Creates a new price alert.
   */
  public async createAlert(payload: Omit<Alert, "id">): Promise<ApiResponse<Alert> | undefined> {
    try {
      const response = await apiClient.post<ApiResponse<Alert>>(this.baseUrl, payload);
      toast.success(response.data.message || "Alert created successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Updates an existing alert.
   */
  public async updateAlert(id: string, payload: Partial<Alert>): Promise<ApiResponse<Alert> | undefined> {
    try {
      const response = await apiClient.patch<ApiResponse<Alert>>(`${this.baseUrl}/${id}`, payload);
      toast.success(response.data.message || "Alert updated successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Deletes an alert.
   */
  public async deleteAlert(id: string): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
      toast.success(response.data.message || "Alert deleted successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Gets AI-powered threshold suggestions for a product.
   */
  public async getThresholdSuggestions(productId: string, marketId: string): Promise<ApiResponse<ThresholdSuggestions> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<ThresholdSuggestions>>(`${this.baseUrl}/suggestions/${productId}/${marketId}`);
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Fetches price trend data for a product.
   */
  public async getPriceTrend(productId: string, marketId: string): Promise<ApiResponse<PriceTrendBucket[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<PriceTrendBucket[]>>(`${this.baseUrl}/trend/${productId}/${marketId}`);
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const alertService = new AlertService();
export default alertService;
