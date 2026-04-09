import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bookmark, Tag, MapPin, DollarSign, Layers, Calendar } from "lucide-react";
import { createWatchlistColumns } from "./columns/watchlist-columns";
import type { WatchList } from "@/model/watch-list.model";
import watchListService from "@/service/watch-list.service";
import { toast } from "sonner";

// Mock data for development
const mockWatchlist: WatchList[] = [
  {
    _id: "wl-001",
    user: "u001",
    product: {
      _id: "p001",
      name: "Rice",
      price: 25000,
      category: "Grains",
      marketId: "Charanci",
      unit: "tiya",
    },
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    _id: "wl-002",
    user: "u001",
    product: {
      _id: "p002",
      name: "Beans",
      price: 20000,
      category: "Legumes",
      marketId: "Ajiwa",
      unit: "tiya",
    },
    createdAt: "2025-12-02T09:30:00Z",
    updatedAt: "2025-12-02T09:30:00Z",
  },
  {
    _id: "wl-003",
    user: "u001",
    product: {
      _id: "p005",
      name: "Palm Oil",
      price: 1500,
      category: "Oils & Seeds",
      marketId: "Dawanau",
      unit: "litre",
    },
    createdAt: "2025-12-05T10:30:00Z",
    updatedAt: "2025-12-05T10:30:00Z",
  },
  {
    _id: "wl-004",
    user: "u001",
    product: {
      _id: "p003",
      name: "Tomatoes",
      price: 5000,
      category: "Vegetables",
      marketId: "Charanci",
      unit: "mudu",
    },
    createdAt: "2025-12-03T11:15:00Z",
    updatedAt: "2025-12-03T11:15:00Z",
  },
  {
    _id: "wl-005",
    user: "u001",
    product: {
      _id: "p010",
      name: "Groundnuts",
      price: 3000,
      category: "Legumes",
      marketId: "Charanci",
      unit: "tiya",
    },
    createdAt: "2025-12-10T10:05:00Z",
    updatedAt: "2025-12-10T10:05:00Z",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

export default function WatchList() {
  const [items, setItems] = useState<WatchList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<WatchList | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<WatchList | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      try {
        const response = await watchListService.getWatchList();
        if (response?.payload) {
          setItems(response.payload.data);
        } else {
          setItems(mockWatchlist);
        }
      } catch {
        setItems(mockWatchlist);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleView = (item: WatchList) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleRemoveClick = (item: WatchList) => {
    setItemToRemove(item);
    setRemoveOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!itemToRemove) return;
    try {
      await watchListService.removeFromWatchList(itemToRemove._id);
      setItems((prev) => prev.filter((i) => i._id !== itemToRemove._id));
    } catch {
      setItems((prev) => prev.filter((i) => i._id !== itemToRemove._id));
      toast.success("Item removed from watchlist");
    } finally {
      setRemoveOpen(false);
      setItemToRemove(null);
    }
  };

  const columns = useMemo(() => createWatchlistColumns(handleView, handleRemoveClick), []);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Bookmark className="h-7 w-7 text-primary-venato" />
          Watch List
        </h1>
        <p className="text-muted-foreground">
          Keep track of products across different markets.
        </p>
      </div>

      {/* Watchlist Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Watched Products</CardTitle>
          <CardDescription>
            {items.length} product{items.length !== 1 ? "s" : ""} in your watchlist
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={items}
            searchKey="product.name"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary-venato" />
              Product Details
            </DialogTitle>
            <DialogDescription>Full details of the watched product</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-4 bg-primary-venato/5 rounded-lg border border-primary-venato/10">
                <Tag className="h-6 w-6 text-primary-venato" />
                <div>
                  <p className="text-sm text-muted-foreground">Product Name</p>
                  <p className="text-xl font-bold">{selectedItem.product?.name || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Price</span>
                  </div>
                  <p className="text-lg font-bold text-primary-venato">
                    {formatPrice(selectedItem.product?.price || 0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Category</span>
                  </div>
                  <p className="font-semibold">{selectedItem.product?.category || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary-venato" />
                  <div>
                    <p className="text-sm text-muted-foreground">Market</p>
                    <p className="font-semibold">{selectedItem.product?.market?.name || "N/A"}</p>
                  </div>
                </div>
                
                {selectedItem.product?.market?.location && (
                  <div className="pl-8 pt-2 border-t border-dashed space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">LGA:</span>
                      <span className="font-medium">{selectedItem.product.market.location.LGA}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">State:</span>
                      <span className="font-medium text-primary-venato">{selectedItem.product.market.location.state}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedItem.product?.unit && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                  <span className="text-sm text-muted-foreground">Unit</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedItem.product.unit}
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Added to watchlist</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedItem.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from watchlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{itemToRemove?.product?.name}" from your watchlist. You can
              always add it back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRemoveConfirm}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
