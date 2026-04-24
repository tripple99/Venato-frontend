import { useState, useCallback } from "react";
import auditLogService from "@/service/audit-log.service";
import type { IAuditLog } from "@/model/audit-log.model";

export function useAuditLogHook() {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchLogs = useCallback(
    async (page: number = 1, limit: number = 10, search?: string) => {
      setIsLoading(true);
      try {
        const response = await auditLogService.getAllAuditLogs(page, limit, search);
        if (response?.status === "success") {
          setLogs(response.payload.data);
          setPagination({
            page: response.payload.currentPage,
            limit: response.payload.limit,
            totalCount: response.payload.totalCount,
            totalPages: response.payload.totalPages,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    logs,
    isLoading,
    pagination,
    setPagination,
    fetchLogs,
  };
}
