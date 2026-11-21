import { type ColumnDef } from "@tanstack/react-table";
import type { IProfile } from "@/model/user.model";
import { AuthRole } from "@/model/auth.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  UserCog,
  Store,
  Ban,
  BadgeCheck,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const createAccessColumns = (
  onView: (user: IProfile) => void,
  onGrantRole: (user: IProfile) => void,
  onAssignMarket: (user: IProfile) => void,
  onRevoke: (user: IProfile) => void,
  onVerify: (user: IProfile) => void,
  onDelete: (user: IProfile) => void
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
      const role = (row.getValue("userRole") || row.original.roles || "user") as string;

      const roleStyles: Record<string, string> = {
        superadmin:
          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
        admin:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        user:
          "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
      };

      const className = roleStyles[role?.toLowerCase()] || roleStyles.user;

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize font-semibold px-2.5 py-0.5 rounded-full shadow-sm",
            className
          )}
        >
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
        return (
          <span className="text-muted-foreground text-xs italic opacity-70">
            None Assigned
          </span>
        );

      return (
        <div className="flex flex-wrap gap-1.5">
          {markets.map((m) => (
            <Badge
              key={m._id || m}
              variant="outline"
              className="text-[10px] bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 py-0 px-2 font-semibold tracking-tight shadow-sm"
            >
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
        <Badge
          variant="outline"
          className={cn(
            "font-medium border-0 px-3 py-1",
            isActive === true
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          )}
        >
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full mr-2",
              isActive === true
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            )}
          />
          {isActive === true ? "Active" : "Inactive"}
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
        <span className="text-muted-foreground/70 text-[13px] font-medium">
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
    cell: ({ row }) => {
      const user = row.original;
      const effectiveRole = (user.userRole || user.roles || "").toLowerCase();
      const isAdmin = effectiveRole === AuthRole.Admin.toLowerCase();

      return (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="View user details"
                className="h-8 w-8 text-muted-foreground hover:text-primary-venato"
                onClick={() => onView(user)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View user details</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Change user role"
                className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/10"
                onClick={() => onGrantRole(user)}
              >
                <UserCog className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Change user role</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Assign market"
                  disabled={!isAdmin}
                  className={cn(
                    "h-8 w-8",
                    isAdmin
                      ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10"
                      : "text-muted-foreground/40 cursor-not-allowed"
                  )}
                  onClick={() => isAdmin && onAssignMarket(user)}
                >
                  <Store className="h-4 w-4" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {isAdmin
                ? "Assign market"
                : "Only admin users can be assigned a market"}
            </TooltipContent>
          </Tooltip>

          {!user.isVerified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Verify user account"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10"
                  onClick={() => onVerify(user)}
                >
                  <BadgeCheck className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Verify user account</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Revoke elevated access"
                className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-500/10"
                onClick={() => onRevoke(user)}
              >
                <Ban className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Revoke elevated access</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete user"
                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete user</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
