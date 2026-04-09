import { type ColumnDef } from "@tanstack/react-table";
import type { Alert } from "@/model/alert.model";
import type { Product } from "@/model/product.model";
import type { IMarketData } from "@/model/market.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Power } from "lucide-react";

export const createAlertColumns = (
  onView: (alert: Alert) => void,
  onEdit: (alert: Alert) => void,
  onDelete: (alert: Alert) => void,
  onToggle: (alert: Alert) => void
): ColumnDef<Alert>[] => [
  {
    accessorKey: "productId",
    header: "Product",
    cell: ({ row }) => {
      const prod = row.getValue("productId") as string | Product;
      const name = typeof prod === "object" && prod !== null ? prod.name : prod;
      return <span className="font-medium text-foreground">{name}</span>;
    },
  },
  {
    accessorKey: "marketId",
    header: "Market",
    cell: ({ row }) => {
      const market = row.getValue("marketId") as string | IMarketData;
      const name = typeof market === "object" && market !== null ? market.name : market;
      return <span className="font-medium">{name}</span>;
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      const condition = row.getValue("condition") as string;
      const conditionLabels: Record<string, string> = {
        above: "Price Above",
        below: "Price Below",
        equal: "Price Equal",
        change_pct: "% Change",
      };
      return (
        <Badge variant="outline" className="capitalize">
          {conditionLabels[condition] || condition}
        </Badge>
      );
    },
  },
  {
    accessorKey: "targetValue",
    header: "Target Value",
    cell: ({ row }) => {
      const condition = row.original.condition;
      const value = row.getValue("targetValue") as number;
      if (condition === "change_pct") {
        return <span className="font-semibold">{value}%</span>;
      }
      return (
        <span className="font-semibold">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: row.original.currency || "NGN",
            minimumFractionDigits: 0,
          }).format(value)}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "success" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastTriggeredAt",
    header: "Last Triggered",
    cell: ({ row }) => {
      const date = row.getValue("lastTriggeredAt") as string;
      if (!date) return <span className="text-muted-foreground text-sm">Never</span>;
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
          className="h-8 w-8 hover:text-blue-600"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${row.original.isActive ? "hover:text-amber-600" : "hover:text-emerald-600"}`}
          onClick={() => onToggle(row.original)}
        >
          <Power className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-red-600 text-red-500"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
