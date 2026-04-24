import type { ColumnDef } from "@tanstack/react-table";
import type { IAuditLog } from "@/model/audit-log.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const createAuditLogColumns = (
  onView: (log: IAuditLog) => void
): ColumnDef<IAuditLog>[] => [
  {
    accessorKey: "actorId",
    header: "Actor",
    cell: ({ row }) => {
      const actor = row.original.actorId;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {actor?.fullname || actor?.name || "System"}
          </span>
          <span className="text-xs text-muted-foreground">{actor?.email || ""}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "actorType",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("actorType") as string;
      return (
        <Badge variant={role === "superadmin" ? "default" : "secondary"} className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("action")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "SUCCESS" ? "success" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.getValue("ipAddress") || "N/A"}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {date.toLocaleDateString("en-NG", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(log)}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
