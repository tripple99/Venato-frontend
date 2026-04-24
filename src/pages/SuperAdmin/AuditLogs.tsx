import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, Activity, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createAuditLogColumns } from "./columns/audit-log-columns";
import { useAuditLogHook } from "./columns/audit-log-hooks";
import type { IAuditLog } from "@/model/audit-log.model";

export default function AuditLogs() {
  const {
    logs,
    isLoading,
    pagination,
    setPagination,
    fetchLogs,
  } = useAuditLogHook();

  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs(pagination.page, pagination.limit, searchTerm);
  }, [pagination.page, pagination.limit, searchTerm, fetchLogs]);

  const handleView = (log: IAuditLog) => {
    setSelectedLog(log);
    setViewOpen(true);
  };

  const columns = useMemo(
    () => createAuditLogColumns(handleView),
    []
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Activity className="h-7 w-7 text-primary-venato" />
          Audit Logs
        </h1>
        <p className="text-muted-foreground">
          View system-wide actions and security events.
        </p>
      </div>

      {/* Logs Table */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">Activity Logs</CardTitle>
              <CardDescription>
                Detailed record of all system modifications
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search action or role..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={logs}
            searchKey="action"
            isLoading={isLoading}
            pageCount={pagination.totalPages}
            pageIndex={pagination.page - 1}
            pageSize={pagination.limit}
            onPaginationChange={({ pageIndex, pageSize }) => {
              setPagination((p) => ({ ...p, page: pageIndex + 1, limit: pageSize }));
            }}
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-venato" />
              Audit Event Details
            </DialogTitle>
            <DialogDescription>Full details of the system event</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-primary-venato/5 rounded-lg border border-primary-venato/10">
                <div className="h-12 w-12 rounded-full bg-primary-venato/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary-venato" />
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {selectedLog.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Performed by: {selectedLog.actorId?.fullname || selectedLog.actorId?.name || "System"}
                    {" "} ({selectedLog.actorType})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedLog.status === "SUCCESS" ? "success" : "destructive"}>
                    {selectedLog.status}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedLog.createdAt).toLocaleString("en-NG")}
                  </p>
                </div>
                {selectedLog.ipAddress && (
                  <div className="p-3 rounded-lg border space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> IP Address
                    </p>
                    <p className="text-sm font-medium">{selectedLog.ipAddress}</p>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div className="p-3 rounded-lg border space-y-1">
                    <p className="text-sm text-muted-foreground">User Agent</p>
                    <p className="text-sm font-medium truncate" title={selectedLog.userAgent}>
                      {selectedLog.userAgent}
                    </p>
                  </div>
                )}
                {selectedLog.entityType && (
                  <div className="p-3 rounded-lg border space-y-1">
                    <p className="text-sm text-muted-foreground">Entity Type</p>
                    <p className="text-sm font-medium">{selectedLog.entityType}</p>
                  </div>
                )}
                {selectedLog.entityId && (
                  <div className="p-3 rounded-lg border space-y-1">
                    <p className="text-sm text-muted-foreground">Entity ID</p>
                    <p className="text-sm font-medium truncate" title={selectedLog.entityId}>
                      {selectedLog.entityId}
                    </p>
                  </div>
                )}
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div className="p-3 rounded-lg border space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Metadata</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {(selectedLog.before || selectedLog.after) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedLog.before && (
                    <div className="p-3 rounded-lg border space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Before</p>
                      <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(selectedLog.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.after && (
                    <div className="p-3 rounded-lg border space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">After</p>
                      <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(selectedLog.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
