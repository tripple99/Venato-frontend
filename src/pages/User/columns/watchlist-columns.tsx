import { type ColumnDef } from "@tanstack/react-table";
import type { WatchList } from "@/model/watch-list.model";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

export const createWatchlistColumns = (
  onView: (item: WatchList) => void,
  onRemove: (item: WatchList) => void
): ColumnDef<WatchList>[] => [
  {
    accessorKey: "product.name",
    header: "Product Name",
    accessorFn: (row) => row.product?.name || "N/A",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.product?.name || "N/A"}</span>
    ),
  },
  {
    accessorKey: "product.price",
    header: "Price",
    accessorFn: (row) => row.product?.price || 0,
    cell: ({ row }) => (
      <span className="font-semibold">{formatPrice(row.original.product?.price || 0)}</span>
    ),
  },
  {
    accessorKey: "product.category",
    header: "Category",
    accessorFn: (row) => row.product?.category || "N/A",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.product?.category || "N/A"}</span>
    ),
  },
  {
    accessorKey: "product.marketId",
    header: "Market",
    accessorFn: (row) => row.product?.marketId || "N/A",
    cell: ({ row }) => (
      <span>{row.original.product?.market?.name || "N/A"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("createdAt")).toLocaleDateString("en-NG", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(row.original)}
          className="hover:text-primary-venato"
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(row.original)}
          className="hover:text-red-600 text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
