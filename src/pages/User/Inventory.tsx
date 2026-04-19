import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { IUnit } from "@/types/market.types";
import { useUserHook } from "./columns/user-hooks";
import InfiniteCombobox from "@/components/infinineCombo";

const inventorySchema = z.object({
  productId: z.string().min(1, "Product is required"),
  preferredMarket: z.string().min(1, "Market is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit: z.nativeEnum(IUnit),
});
type InventoryFormValues = z.infer<typeof inventorySchema>;

export default function Inventory() {
  const {
    inventory: items,
    inventoryPagination: pagination,
    isLoading,
    fetchInventory,
    createInventory,
    deleteInventory,
    markets,
    marketPagination,
    fetchAllMarkets,
    loadMoreMarkets,
    products,
    productPagination,
    fetchAllProducts,
    loadMoreProducts,
  } = useUserHook();

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Form state
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      productId: "",
      quantity: 0,
      unit: IUnit.TIYA,
      preferredMarket: "",
    },
  });

  const watchPreferredMarket = form.watch("preferredMarket");
  const watchProductId = form.watch("productId");

  const selectedProductData = useMemo(() => 
    products.find(p => p._id === watchProductId),
    [products, watchProductId]
  );

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (addOpen) {
      fetchAllMarkets(1);
    }
  }, [addOpen, fetchAllMarkets]);

  const handleMarketChange = (val: string) => {
    form.setValue("preferredMarket", val, { shouldValidate: true });
    form.setValue("productId", "", { shouldValidate: true });
    if (val) {
      fetchAllProducts(1, val);
    }
  };

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
    const result = await deleteInventory(itemToDelete._id);
    if (result.success) {
      setDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAdd = async (data: InventoryFormValues) => {
    const result = await createInventory(data as any);
    if (result.success) {
      setAddOpen(false);
      form.reset();
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
            onPaginationChange={(p) => fetchInventory(p.pageIndex + 1, p.pageSize)}
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAdd)}>
              <div className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="preferredMarket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Market</FormLabel>
                      <FormControl>
                        <InfiniteCombobox
                          items={markets.map((m) => ({ value: m._id, label: m.name }))}
                          value={field.value}
                          onChange={handleMarketChange}
                          onLoadMore={loadMoreMarkets}
                          hasMore={marketPagination.hasNextPage}
                          isLoading={isLoading}
                          placeholder="Select market"
                          searchPlaceholder="Search markets..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product ID</FormLabel>
                      <FormControl>
                        <InfiniteCombobox
                          items={products.map((p) => ({ value: p._id, label: p.name }))}
                          value={field.value}
                          onChange={(val) => form.setValue("productId", val, { shouldValidate: true })}
                          onLoadMore={() => loadMoreProducts(watchPreferredMarket)}
                          hasMore={productPagination.hasNextPage}
                          isLoading={isLoading}
                          placeholder={watchPreferredMarket ? "Select product" : "Select a market first"}
                          searchPlaceholder="Search products..."
                          disabled={!watchPreferredMarket}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedProductData && (
                  <div className="p-3 rounded-lg bg-primary-venato/5 border border-primary-venato/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 rounded-md bg-primary-venato/10">
                        <Package className="h-4 w-4 text-primary-venato" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground leading-none mb-1">Market Price</p>
                        <p className="text-sm font-bold text-primary-venato">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: selectedProductData.market?.currency || "NGN",
                            minimumFractionDigits: 0,
                          }).format(selectedProductData.price)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-background/50 text-[10px] h-5">
                      Base unit: {selectedProductData.unit}
                    </Badge>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(IUnit).map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary-venato hover:bg-primary-venato/90">
                  Add Item
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
