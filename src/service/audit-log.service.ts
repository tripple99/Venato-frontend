import type { PaginatedApiResponse } from "@/model/api";
import type { IAuditLog } from "@/model/audit-log.model";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";

class AuditLogService {
  private baseUrl: string = "/audit-logs";

  public async getAllAuditLogs(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedApiResponse<IAuditLog> | undefined> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<IAuditLog>>(
        `${this.baseUrl}`,
        {
          params: { page, limit, search },
        }
      );
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const auditLogService = new AuditLogService();
export default auditLogService;
