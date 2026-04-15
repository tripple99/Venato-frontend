import type { ApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import { toast } from "sonner";
import { AuthRole, AllowedMarkets } from "@/model/auth.model";

class AccessService {
  private baseUrl: string = "/access";

  /**
   * (Super Admin) Assigns a new AuthRole to a specific user.
   * @param userId The user's unique ID
   * @param userRole The role to be granted
   */
  public async grantUserRole(userId: string, userRole: AuthRole): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(`${this.baseUrl}/${userId}`, { userRole });
      toast.success(response.data.message || "User role granted successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * (Super Admin) Grants a user access to a specific market.
   * @param userId The user's unique ID
   * @param marketId The market's unique ID
   * @param data Additional metadata for the access grant
   */
  public async grantMarketAccess(userId: string, marketId: string, data?: any): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.patch<ApiResponse<any>>(`${this.baseUrl}/${userId}/${marketId}`, data);
      toast.success(response.data.message || "Market access granted successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }




  /**
   * (Super Admin) Revokes a user's access to a specific market or updates their role status.
   * @param userId The user's unique ID
   * @param marketId The market's unique ID
   */
  public async revokeUserAccess(
    userId: string, 
  ): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.patch<ApiResponse<any>>(`${this.baseUrl}/revoke/${userId}`);
      toast.success(response.data.message || "User access revoked successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const accessService = new AccessService();
export default accessService;
