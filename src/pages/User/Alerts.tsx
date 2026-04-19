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
import {
  Bell,
  Plus,
  Target,
  TrendingUp,
  Clock,
  Power,
  Zap,
  Activity,
} from "lucide-react";
import { createAlertColumns } from "./columns/alert-columns";
import type { Alert } from "@/model/alert.model";
import { useUserHook } from "./columns/user-hooks";
import InfiniteCombobox from "@/components/infinineCombo";



const conditionLabels: Record<string, string> = {
  above: "Price Above",
  below: "Price Below",
  equal: "Price Equal",
  change_pct: "% Change",
};

const alertSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  marketId: z.string().min(1, "Market is required"),
  targetValue: z.number().min(0.01, "Target value must be greater than 0"),
  condition: z.enum(["equal", "above", "below", "change_pct"]),
  currency: z.string(),
  cooldownMinutes: z.number().min(0, "Cooldown must be non-negative"),
  isActive: z.boolean(),
});
type AlertFormValues = z.infer<typeof alertSchema>;

export default function Alerts() {
  const {
    alert: alerts,
    alertPagination: pagination,
    isLoading,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    markets,
    marketPagination,
    fetchAllMarkets,
    loadMoreMarkets,
    products,
    productPagination,
    fetchAllProducts,
    loadMoreProducts,
  } = useUserHook();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

  // Form state
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      productId: "",
      marketId: "",
      targetValue: 0,
      condition: "above",
      currency: "NGN",
      cooldownMinutes: 60,
      isActive: true,
    },
  });

  const watchMarketId = form.watch("marketId");
  const watchCondition = form.watch("condition");
  const watchProductId = form.watch("productId");

  const selectedProductData = useMemo(() => 
    products.find(p => p._id === watchProductId),
    [products, watchProductId]
  );



  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if (createOpen || editOpen) {
      fetchAllMarkets(1);
    }
  }, [createOpen, editOpen, fetchAllMarkets]);

  const handleView = (alert: Alert) => {
    setSelectedAlert(alert);
    setViewOpen(true);
  };

  const handleEdit = (alert: Alert) => {
    setSelectedAlert(alert);
    const mId = typeof alert.market === "string" ? alert.market : alert.market?._id;
    form.reset({
      productId: typeof alert.productId === "string" ? alert.productId : alert.productId?._id || "",
      marketId: mId || "",
      targetValue: alert.targetValue,
      condition: alert.condition as any,
      currency: alert.currency,
      cooldownMinutes: alert.cooldownMinutes || 60,
      isActive: alert.isActive,
    });
    if (mId) fetchAllProducts(1, mId);
    setEditOpen(true);
  };

  const handleDeleteClick = (alert: Alert) => {
    setAlertToDelete(alert);
    setDeleteOpen(true);
  };

  const handleToggle = async (alert: Alert) => {
    await updateAlert(alert._id || alert.id || "", { isActive: !alert.isActive });
  };

  const handleDeleteConfirm = async () => {
    if (!alertToDelete) return;
    const result = await deleteAlert(alertToDelete._id || alertToDelete.id || "");
    if (result.success) {
      setDeleteOpen(false);
      setAlertToDelete(null);
    }
  };

  const handleCreate = async (data: AlertFormValues) => {
    const result = await createAlert(data as any);
    if (result.success) {
      setCreateOpen(false);
      resetForm();
    }
  };

  const handleUpdate = async (data: AlertFormValues) => {
    if (!selectedAlert) return;
    const result = await updateAlert(selectedAlert._id || selectedAlert.id || "", data as any);
    if (result.success) {
      setEditOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    form.reset({
      productId: "",
      marketId: "",
      targetValue: 0,
      condition: "above",
      currency: "NGN",
      cooldownMinutes: 60,
      isActive: true,
    });
  };

  const handleMarketChange = (val: string) => {
    form.setValue("marketId", val, { shouldValidate: true });
    form.setValue("productId", "", { shouldValidate: true });
    if (val) {
      fetchAllProducts(1, val);
    }
  };

  const columns = useMemo(
    () => createAlertColumns(handleView, handleEdit, handleDeleteClick, handleToggle),
    []
  );

  const activeCount = alerts.filter((a) => a.isActive).length;

  const alertFormFields = (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="marketId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Market</FormLabel>
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
              <FormLabel>Product</FormLabel>
              <FormControl>
                <InfiniteCombobox
                  items={products.map((p) => ({ value: p._id, label: p.name }))}
                  value={field.value}
                  onChange={(val) => form.setValue("productId", val, { shouldValidate: true })}
                  onLoadMore={() => loadMoreProducts(watchMarketId)}
                  hasMore={productPagination.hasNextPage}
                  isLoading={isLoading}
                  placeholder={watchMarketId ? "Select product" : "Select a market first"}
                  searchPlaceholder="Search products..."
                  disabled={!watchMarketId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {selectedProductData && (
        <div className="p-3 rounded-lg bg-primary-venato/5 border border-primary-venato/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary-venato/10">
              <TrendingUp className="h-4 w-4 text-primary-venato" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none mb-1">Current Market Price</p>
              <p className="text-sm font-bold text-primary-venato">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: selectedProductData.market?.currency || "NGN",
                  minimumFractionDigits: 0,
                }).format(selectedProductData.price)}
                <span className="text-[10px] text-muted-foreground ml-1 font-normal">
                  per {selectedProductData.unit}
                </span>
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-background/50 text-[10px] h-5">
            {selectedProductData.market?.name}
          </Badge>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger id="alert-condition">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="above">Price Above</SelectItem>
                  <SelectItem value="below">Price Below</SelectItem>
                  <SelectItem value="equal">Price Equal</SelectItem>
                  <SelectItem value="change_pct">% Change</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {watchCondition === "change_pct" ? "Percentage" : "Target Price"}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={watchCondition === "change_pct" ? "e.g. 10" : "e.g. 25000"}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="cooldownMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cooldown (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g. 60"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-7 w-7 text-primary-venato" />
            Alerts
          </h1>
          <p className="text-muted-foreground">
            Configure price alerts for products you're tracking.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-primary-venato hover:bg-primary-venato/90 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Alert
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-primary-venato/10">
              <Zap className="h-5 w-5 text-primary-venato" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-muted">
              <Power className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold">{alerts.length - activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Alert Rules</CardTitle>
          <CardDescription>
            Manage your price alert configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={alerts}
            searchKey="productId"
            isLoading={isLoading}
            pagination={pagination}
            pageCount={pagination.totalPages}
            pageIndex={pagination.currentPage - 1}
            pageSize={pagination.limit}
            onPaginationChange={(p) => fetchAlerts(p.pageIndex + 1, p.pageSize)}
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */} 
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-venato" />
              Alert Details
            </DialogTitle>
            <DialogDescription>Full configuration of this alert</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={selectedAlert.isActive ? "success" : "secondary"}>
                  {selectedAlert.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-mono font-semibold">
                    {typeof selectedAlert.productId === "string" 
                      ? selectedAlert.productId 
                      : selectedAlert.productId.name}
                  </p>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Market</p>
                  <p className="font-semibold">
                    {typeof selectedAlert.market === "string" 
                      ? selectedAlert.market 
                      : selectedAlert?.market?.name}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary-venato/5 border border-primary-venato/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary-venato" />
                  <span className="font-semibold">Rule Configuration</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Condition</p>
                    <Badge variant="outline">{conditionLabels[selectedAlert.condition]}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-bold">
                      {selectedAlert.condition === "change_pct"
                        ? `${selectedAlert.targetValue}%`
                        : new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: selectedAlert.currency || "NGN",
                            minimumFractionDigits: 0,
                          }).format(selectedAlert.targetValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cooldown</p>
                    <p className="font-semibold">
                      {selectedAlert.cooldownMinutes || 0} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Triggered</p>
                    <p className="text-sm font-medium">
                      {selectedAlert.lastTriggeredAt
                        ? new Date(selectedAlert.lastTriggeredAt).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Alert Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary-venato" />
              Create Alert
            </DialogTitle>
            <DialogDescription>
              Set up a new price alert for a product
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)}>
              {alertFormFields}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setCreateOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-venato hover:bg-primary-venato/90"
                >
                  Create Alert
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-venato" />
              Edit Alert
            </DialogTitle>
            <DialogDescription>Update alert configuration</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)}>
              {alertFormFields}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setEditOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-venato hover:bg-primary-venato/90"
                >
                  Save Changes
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
            <AlertDialogTitle>Delete alert?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this alert rule. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
