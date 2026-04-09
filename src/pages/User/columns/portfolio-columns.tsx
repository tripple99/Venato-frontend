import { type ColumnDef } from "@tanstack/react-table";
import type { PortfolioHolding } from "@/model/portfolio.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

export const createPortfolioColumns = (
  onView: (holding: PortfolioHolding) => void
): ColumnDef<PortfolioHolding>[] => [
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.getValue("productName")}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span>
        {row.getValue("quantity")} <span className="text-muted-foreground text-xs">{row.original.unit}</span>
      </span>
    ),
  },
  {
    accessorKey: "currentPrice",
    header: "Current Price",
    cell: ({ row }) => (
      <span className="font-semibold">{formatPrice(row.getValue("currentPrice"))}</span>
    ),
  },
  {
    accessorKey: "previousPrice",
    header: "Previous Price",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatPrice(row.getValue("previousPrice"))}</span>
    ),
  },
  {
    accessorKey: "percentageChange",
    header: "Change",
    cell: ({ row }) => {
      const change = row.getValue("percentageChange") as number;
      const isPositive = change >= 0;
      return (
        <div className={`flex items-center gap-1 font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
          {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      );
    },
  },
  {
    accessorKey: "currentValue",
    header: "Total Value",
    cell: ({ row }) => (
      <span className="font-bold text-primary-venato">{formatPrice(row.getValue("currentValue"))}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "increased" ? "success" : "destructive"}>
          {status === "increased" ? "▲ Up" : "▼ Down"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(row.original)}
        className="hover:text-primary-venato"
      >
        <Eye className="h-4 w-4 mr-1" /> View
      </Button>
    ),
  },
];
