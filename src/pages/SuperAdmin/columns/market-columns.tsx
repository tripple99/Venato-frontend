import { type ColumnDef } from "@tanstack/react-table";
import type { IMarketData } from "@/model/market.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 font-bold px-2 py-0">
        {row.getValue("currency")}
      </Badge>
    ),
  },
  {
    accessorKey: "location.state",
    header: "State",
    accessorFn: (row) => row.location?.state || "N/A",
    cell: ({ row }) => (
      <span className="text-[13px] font-medium text-foreground/80">{row.original.location?.state || "N/A"}</span>
    ),
  },
  {
    accessorKey: "location.LGA",
    header: "LGA",
    accessorFn: (row) => row.location?.LGA || "N/A",
    cell: ({ row }) => (
      <span className="text-muted-foreground/70 text-[12px] italic">{row.original.location?.LGA || "N/A"}</span>
    ),
  },
  {
    accessorKey: "location.country",
    header: "Country",
    accessorFn: (row) => row.location?.country || "N/A",
    cell: ({ row }) => (
      <span className="text-[13px] text-foreground/80">{row.original.location?.country || "N/A"}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge 
          variant="outline" 
          className={cn(
            "font-medium border-0 px-3 py-1",
            isActive 
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          )}
        >
          <div className={cn(
            "h-1.5 w-1.5 rounded-full mr-2",
            isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
          )} />
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
