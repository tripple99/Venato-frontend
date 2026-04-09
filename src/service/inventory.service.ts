import type { ApiResponse, PaginatedApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import { toast } from "sonner";
import type { InventoryItem } from "@/model/inventory.model";

class InventoryService {
  private baseUrl: string = "/inventory";

  /**
   * Fetches all inventory items for the current user.
   */
  public async getInventory(params?: Record<string, string | number | boolean | undefined>): Promise<PaginatedApiResponse<InventoryItem> | undefined> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<InventoryItem>>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Adds a new inventory item.
   */
  public async addInventoryItem(payload: Omit<InventoryItem, "_id" | "userId">): Promise<ApiResponse<InventoryItem> | undefined> {
    try {
      const response = await apiClient.post<ApiResponse<InventoryItem>>(this.baseUrl, payload);
      toast.success(response.data.message || "Item added to inventory");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Updates an existing inventory item.
   */
  public async updateInventoryItem(id: string, payload: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem> | undefined> {
    try {
      const response = await apiClient.patch<ApiResponse<InventoryItem>>(`${this.baseUrl}/${id}`, payload);
      toast.success(response.data.message || "Inventory item updated");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Removes an item from the inventory.
   */
  public async removeInventoryItem(id: string): Promise<ApiResponse<void> | undefined> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
      toast.success(response.data.message || "Item removed from inventory");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
