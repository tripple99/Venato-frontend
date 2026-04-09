import { type ColumnDef } from "@tanstack/react-table";
import type { InventoryItem } from "@/model/inventory.model";
import type { Product } from "@/model/product.model";
import type { IMarketData } from "@/model/market.model";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

export const createInventoryColumns = (
  onView: (item: InventoryItem) => void,
  onDelete: (item: InventoryItem) => void
): ColumnDef<InventoryItem>[] => [
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
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("quantity")}</span>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.getValue("unit")}</span>
    ),
  },
  {
    accessorKey: "preferredMarket",
    header: "Preferred Market",
    cell: ({ row }) => {
      const market = row.getValue("preferredMarket") as string | IMarketData;
      const name = typeof market === "object" && market !== null ? market.name : market;
      return <span className="font-medium">{name}</span>;
    },
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
          onClick={() => onDelete(row.original)}
          className="hover:text-red-600 text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
