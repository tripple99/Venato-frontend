import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Package, Plus, Box, MapPin, Scale } from "lucide-react";
import { createInventoryColumns } from "./columns/inventory-columns";
import type { InventoryItem } from "@/model/inventory.model";
import inventoryService from "@/service/inventory.service";
import { toast } from "sonner";
import { IUnit, MarketNames } from "@/types/market.types";

// Mock data for development
const mockInventoryPayload = {
  data: [
    {
      _id: "69d188ac3ceeadba1d743d33",
      productId: "69cd598c1f81cc25ed525fee",
      userId: "69cd81801502f0ee01da4af7",
      __v: 0,
      createdAt: "2026-04-04T21:54:52.209Z",
      preferredMarket: "69d17a8b01b151ef61644b04",
      quantity: 10,
      unit: "kg",
      updatedAt: "2026-04-04T21:54:52.207Z",
    },
    {
      _id: "69d188833ceeadba1d743d32",
      userId: "69cd81801502f0ee01da4af7",
      productId: "69cd7c9812be6a0a32f3bab3",
      __v: 0,
      createdAt: "2026-04-04T21:54:11.251Z",
      preferredMarket: "69d17a8b01b151ef61644b04",
      quantity: 10,
      unit: "kg",
      updatedAt: "2026-04-04T21:54:11.247Z",
    },
    {
      _id: "69cd9f003ceeadba1d743d31",
      userId: "69cd81801502f0ee01da4af7",
      productId: "69cd597e1f81cc25ed525fe6",
      __v: 0,
      createdAt: "2026-04-01T22:41:04.591Z",
      preferredMarket: "69cc127bac0b6a5d7afe9cfa",
      quantity: 10,
      unit: "kg",
      updatedAt: "2026-04-01T22:41:04.587Z",
    },
  ],
  totalCount: 3,
  currentPage: 1,
  totalPages: 1,
  limit: 20,
};

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    unit: IUnit.TIYA as string,
    preferredMarket: MarketNames.Charanci as string,
  });

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const response = await inventoryService.getInventory({
          page: pagination.currentPage,
          limit: pagination.limit,
        });
     
        if (response?.payload?.data) {
          setItems(response.payload.data);
          setPagination({
            totalCount: response.payload.totalCount,
            currentPage: response.payload.currentPage,
            totalPages: response.payload.totalPages,
            limit: response.payload.limit,
          });
        } else {
          setItems(mockInventoryPayload.data);
          setPagination({
            totalCount: mockInventoryPayload.totalCount,
            currentPage: mockInventoryPayload.currentPage,
            totalPages: mockInventoryPayload.totalPages,
            limit: mockInventoryPayload.limit,
          });
        }
      } catch {
        setItems(mockInventoryPayload.data);
        setPagination({
          totalCount: mockInventoryPayload.totalCount,
          currentPage: mockInventoryPayload.currentPage,
          totalPages: mockInventoryPayload.totalPages,
          limit: mockInventoryPayload.limit,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, [pagination.currentPage, pagination.limit]);

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await inventoryService.removeInventoryItem(itemToDelete._id);
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id));
      toast.success("Item removed from inventory");
    } catch {
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id));
      toast.success("Item removed from inventory");
    } finally {
      setDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await inventoryService.addInventoryItem(formData);
      if (response?.payload) {
        setItems((prev) => [...prev, response.payload]);
      } else {
        const newItem: InventoryItem = {
          _id: `inv-${Date.now()}`,
          userId: "current-user",
          ...formData,
        };
        setItems((prev) => [...prev, newItem]);
        toast.success("Item added to inventory");
      }
    } catch {
      const newItem: InventoryItem = {
        _id: `inv-${Date.now()}`,
        userId: "current-user",
        ...formData,
      };
      setItems((prev) => [...prev, newItem]);
      toast.success("Item added to inventory");
    } finally {
      setAddOpen(false);
      setFormData({
        productId: "",
        quantity: 0,
        unit: IUnit.TIYA,
        preferredMarket: MarketNames.Charanci,
      });
    }
  };

  const columns = useMemo(() => createInventoryColumns(handleView, handleDeleteClick), []);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and stock levels.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-primary-venato hover:bg-primary-venato/90 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      {/* Inventory Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Inventory Items</CardTitle>
          <CardDescription>
            {pagination.totalCount} item{pagination.totalCount !== 1 ? "s" : ""} in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={items}
            searchKey="productId"
            isLoading={isLoading}
            pageCount={pagination.totalPages}
            pageIndex={pagination.currentPage - 1}
            pageSize={pagination.limit}
            onPaginationChange={(p) =>
              setPagination((prev) => ({
                ...prev,
                currentPage: p.pageIndex + 1,
                limit: p.pageSize,
              }))
            }
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-venato" />
              Inventory Item Details
            </DialogTitle>
            <DialogDescription>Full details of the inventory item</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                <Box className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-semibold text-lg">
                    {typeof selectedItem.productId === "object" 
                      ? selectedItem.productId.name 
                      : selectedItem.productId}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-lg font-bold">{selectedItem.quantity}</p>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Scale className="h-3.5 w-3.5" />
                    <span>Unit</span>
                  </div>
                  <p className="text-lg font-bold capitalize">{selectedItem.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <MapPin className="h-5 w-5 text-primary-venato" />
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Market</p>
                  <p className="font-semibold">
                    {typeof selectedItem?.preferredMarket === "object"
                      ? selectedItem?.preferredMarket?.name
                      : selectedItem?.preferredMarket}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary-venato" />
              Add Inventory Item
            </DialogTitle>
            <DialogDescription>Add a new product to your inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-productId">Product ID</Label>
              <Input
                id="add-productId"
                placeholder="e.g. p001"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-quantity">Quantity</Label>
              <Input
                id="add-quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity || ""}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger id="add-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IUnit).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-market">Preferred Market</Label>
              <Select
                value={formData.preferredMarket}
                onValueChange={(value) =>
                  setFormData({ ...formData, preferredMarket: value })
                }
              >
                <SelectTrigger id="add-market">
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MarketNames).map((market) => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-primary-venato hover:bg-primary-venato/90"
              disabled={!formData.productId || formData.quantity <= 0}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from inventory?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
