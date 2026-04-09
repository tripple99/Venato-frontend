import { type ColumnDef } from "@tanstack/react-table";
import type { Products } from "@/types/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

export const createProductColumns = (
  onView: (product: Products) => void,
  onEdit: (product: Products) => void,
  onDelete: (product: Products) => void
): ColumnDef<Products>[] => [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-semibold text-primary-venato">{formatPrice(row.getValue("price"))}</span>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">{row.getValue("unit")}</Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("category")}</Badge>
    ),
  },
  {
    accessorKey: "market",
    header: "Market",
    cell: ({ row }) => {
      const market = row.getValue("market") as string | IMarketData;
      const name = typeof market === "object" && market !== null ? market.name : market;
      return <span className="font-medium">{name}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("created_at")).toLocaleDateString("en-NG", {
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
          className="h-8 w-8 hover:text-red-600 text-red-500"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
