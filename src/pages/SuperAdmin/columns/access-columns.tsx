import { type ColumnDef } from "@tanstack/react-table";
import type { IProfile } from "@/model/user.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Shield, ShieldOff } from "lucide-react";

export const createAccessColumns = (
  onView: (user: IProfile) => void,
  onGrantRole: (user: IProfile) => void,
  onRevoke: (user: IProfile) => void
): ColumnDef<IProfile>[] => [
  {
    accessorKey: "fullname",
    header: "Full Name",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.getValue("fullname")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "userRole",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("userRole") as string;
      const variant = role === "superadmin" ? "default" : role === "admin" ? "warning" : "secondary";
      return (
        <Badge variant={variant} className="capitalize">
          {role || "user"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "allowedMarkets",
    header: "Allowed Markets",
    cell: ({ row }) => {
      const markets = row.getValue("allowedMarkets") as any[] | undefined;
      if (!markets || markets.length === 0)
        return <span className="text-muted-foreground text-sm">None</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {markets.map((m) => (
            <Badge key={m._id || m} variant="outline" className="text-xs">
              {m.name || m}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean | undefined;
      return (
        <Badge variant={isActive !== false ? "success" : "destructive"}>
          {isActive !== false ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      const date = row.getValue("lastActive") as Date | undefined;
      if (!date) return <span className="text-muted-foreground text-sm">N/A</span>;
      return (
        <span className="text-muted-foreground text-sm">
          {new Date(date).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-primary-venato"
          onClick={() => onView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-emerald-600"
          onClick={() => onGrantRole(row.original)}
          title="Grant Role / Market Access"
        >
          <Shield className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-red-600 text-red-500"
          onClick={() => onRevoke(row.original)}
          title="Revoke Access"
        >
          <ShieldOff className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
