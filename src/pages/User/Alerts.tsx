import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
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
import alertService from "@/service/alert.service";
import { toast } from "sonner";

// Mock data for development
const mockAlerts: Alert[] = [
  {
    id: "a001",
    productId: "p001",
    marketId: "Charanci",
    targetValue: 30000,
    condition: "above",
    currency: "NGN",
    cooldownMinutes: 60,
    isActive: true,
    lastTriggeredAt: "2025-12-15T14:30:00Z",
  },
  {
    id: "a002",
    productId: "p002",
    marketId: "Ajiwa",
    targetValue: 18000,
    condition: "below",
    currency: "NGN",
    cooldownMinutes: 120,
    isActive: true,
  },
  {
    id: "a003",
    productId: "p005",
    marketId: "Dawanau",
    targetValue: 10,
    condition: "change_pct",
    currency: "NGN",
    cooldownMinutes: 30,
    isActive: false,
    lastTriggeredAt: "2025-12-10T09:00:00Z",
  },
  {
    id: "a004",
    productId: "p003",
    marketId: "Charanci",
    targetValue: 5000,
    condition: "equal",
    currency: "NGN",
    isActive: true,
  },
  {
    id: "a005",
    productId: "p007",
    marketId: "Charanci",
    targetValue: 8000,
    condition: "above",
    currency: "NGN",
    cooldownMinutes: 60,
    isActive: false,
  },
];

const conditionLabels: Record<string, string> = {
  above: "Price Above",
  below: "Price Below",
  equal: "Price Equal",
  change_pct: "% Change",
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    productId: "",
    marketId: "",
    targetValue: 0,
    condition: "above" as Alert["condition"],
    currency: "NGN",
    cooldownMinutes: 60,
    isActive: true,
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const response = await alertService.getAlerts();
        if (response?.payload) {
          setAlerts(response.payload);
        } else {
          setAlerts(mockAlerts);
        }
      } catch {
        setAlerts(mockAlerts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleView = (alert: Alert) => {
    setSelectedAlert(alert);
    setViewOpen(true);
  };

  const handleEdit = (alert: Alert) => {
    setSelectedAlert(alert);
    setFormData({
      productId: alert.productId,
      marketId: alert.marketId,
      targetValue: alert.targetValue,
      condition: alert.condition,
      currency: alert.currency,
      cooldownMinutes: alert.cooldownMinutes || 60,
      isActive: alert.isActive,
    });
    setEditOpen(true);
  };

  const handleDeleteClick = (alert: Alert) => {
    setAlertToDelete(alert);
    setDeleteOpen(true);
  };

  const handleToggle = async (alert: Alert) => {
    try {
      await alertService.updateAlert(alert.id, { isActive: !alert.isActive });
      setAlerts((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, isActive: !a.isActive } : a))
      );
      toast.success(`Alert ${!alert.isActive ? "activated" : "deactivated"}`);
    } catch {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, isActive: !a.isActive } : a))
      );
      toast.success(`Alert ${!alert.isActive ? "activated" : "deactivated"}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!alertToDelete) return;
    try {
      await alertService.deleteAlert(alertToDelete.id);
      setAlerts((prev) => prev.filter((a) => a.id !== alertToDelete.id));
    } catch {
      setAlerts((prev) => prev.filter((a) => a.id !== alertToDelete.id));
      toast.success("Alert deleted");
    } finally {
      setDeleteOpen(false);
      setAlertToDelete(null);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await alertService.createAlert(formData);
      if (response?.payload) {
        setAlerts((prev) => [...prev, response.payload]);
      } else {
        const newAlert: Alert = { id: `a-${Date.now()}`, ...formData };
        setAlerts((prev) => [...prev, newAlert]);
        toast.success("Alert created");
      }
    } catch {
      const newAlert: Alert = { id: `a-${Date.now()}`, ...formData };
      setAlerts((prev) => [...prev, newAlert]);
      toast.success("Alert created");
    } finally {
      setCreateOpen(false);
      resetForm();
    }
  };

  const handleUpdate = async () => {
    if (!selectedAlert) return;
    try {
      await alertService.updateAlert(selectedAlert.id, formData);
      setAlerts((prev) =>
        prev.map((a) => (a.id === selectedAlert.id ? { ...a, ...formData } : a))
      );
      toast.success("Alert updated");
    } catch {
      setAlerts((prev) =>
        prev.map((a) => (a.id === selectedAlert.id ? { ...a, ...formData } : a))
      );
      toast.success("Alert updated");
    } finally {
      setEditOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      productId: "",
      marketId: "",
      targetValue: 0,
      condition: "above",
      currency: "NGN",
      cooldownMinutes: 60,
      isActive: true,
    });
  };

  const columns = useMemo(
    () => createAlertColumns(handleView, handleEdit, handleDeleteClick, handleToggle),
    []
  );

  const activeCount = alerts.filter((a) => a.isActive).length;

  // Alert form JSX (reused for create & edit)
  const alertForm = (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="alert-product">Product ID</Label>
          <Input
            id="alert-product"
            placeholder="e.g. p001"
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alert-market">Market ID</Label>
          <Input
            id="alert-market"
            placeholder="e.g. Charanci"
            value={formData.marketId}
            onChange={(e) => setFormData({ ...formData, marketId: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="alert-condition">Condition</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) =>
              setFormData({ ...formData, condition: value as Alert["condition"] })
            }
          >
            <SelectTrigger id="alert-condition">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Price Above</SelectItem>
              <SelectItem value="below">Price Below</SelectItem>
              <SelectItem value="equal">Price Equal</SelectItem>
              <SelectItem value="change_pct">% Change</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="alert-target">
            {formData.condition === "change_pct" ? "Percentage" : "Target Price"}
          </Label>
          <Input
            id="alert-target"
            type="number"
            placeholder={formData.condition === "change_pct" ? "e.g. 10" : "e.g. 25000"}
            value={formData.targetValue || ""}
            onChange={(e) =>
              setFormData({ ...formData, targetValue: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="alert-cooldown">Cooldown (minutes)</Label>
        <Input
          id="alert-cooldown"
          type="number"
          placeholder="e.g. 60"
          value={formData.cooldownMinutes || ""}
          onChange={(e) =>
            setFormData({ ...formData, cooldownMinutes: Number(e.target.value) })
          }
        />
      </div>
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
                  <p className="text-sm text-muted-foreground">Product ID</p>
                  <p className="font-mono font-semibold">{selectedAlert.productId}</p>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <p className="text-sm text-muted-foreground">Market</p>
                  <p className="font-semibold">{selectedAlert.marketId}</p>
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
          {alertForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-primary-venato hover:bg-primary-venato/90"
              disabled={!formData.productId || !formData.marketId || formData.targetValue <= 0}
            >
              Create Alert
            </Button>
          </DialogFooter>
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
          {alertForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-primary-venato hover:bg-primary-venato/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
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
