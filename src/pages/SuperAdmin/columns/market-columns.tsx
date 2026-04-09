import { type ColumnDef } from "@tanstack/react-table";
import type { IMarketData } from "@/model/market.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

export const createMarketColumns = (
  onView: (market: IMarketData) => void,
  onEdit: (market: IMarketData) => void,
  onDelete: (market: IMarketData) => void
): ColumnDef<IMarketData>[] => [
  {
    accessorKey: "name",
    header: "Market Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("currency")}</Badge>
    ),
  },
  {
    accessorKey: "location.state",
    header: "State",
    accessorFn: (row) => row.location?.state || "N/A",
    cell: ({ row }) => (
      <span>{row.original.location?.state || "N/A"}</span>
    ),
  },
  {
    accessorKey: "location.LGA",
    header: "LGA",
    accessorFn: (row) => row.location?.LGA || "N/A",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.location?.LGA || "N/A"}</span>
    ),
  },
  {
    accessorKey: "location.country",
    header: "Country",
    accessorFn: (row) => row.location?.country || "N/A",
    cell: ({ row }) => (
      <span>{row.original.location?.country || "N/A"}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
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
          className="h-8 w-8 hover:text-red-600 text-red-500"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
