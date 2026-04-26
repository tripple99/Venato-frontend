import type { ApiResponse, PaginatedApiResponse } from "@/model/api";
import type { INotification, NotificationStatus, NotificationType } from "@/model/notification.model";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";

class NotificationService {
  private baseUrl: string = "/notifications";

  public async getUserNotifications(
    page: number = 1,
    limit: number = 10,
    status?: NotificationStatus,
    type?: NotificationType
  ): Promise<PaginatedApiResponse<INotification>> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<INotification>>(
        this.baseUrl,
        {
          params: { page, limit, status, type },
        }
      );
      return response.data;
    } catch (error) {
      handleAnyError(error);
      throw error;
    }
  }

  public async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>(
        `${this.baseUrl}/unread-count`
      );
      return response.data.payload?.count || 0;
    } catch (error) {
      handleAnyError(error);
      throw error;
    }
  }

  public async markAsRead(id: string): Promise<INotification> {
    try {
      const response = await apiClient.patch<ApiResponse<INotification>>(
        `${this.baseUrl}/${id}/read`
      );
      return response.data.payload as INotification;
    } catch (error) {
      handleAnyError(error);
      throw error;
    }
  }

  public async markAllAsRead(): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/read-all`);
    } catch (error) {
      handleAnyError(error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
