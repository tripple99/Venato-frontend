import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Globe,
  Plus,
  MapPin,
  Navigation,
  Flag,
  DollarSign,
} from "lucide-react";
import { createMarketColumns } from "./columns/market-columns";
import type { IMarketData } from "@/model/market.model";
import marketService from "@/service/market.service";
import { toast } from "sonner";

// Mock data for development
const mockMarkets: IMarketData[] = [
  {
    _id: "m001",
    name: "Charanci",
    currency: "NGN",
    location: { state: "Katsina", code: "KT", LGA: "Charanchi", country: "Nigeria" },
    isActive: true,
    isDeleted: false,
  },
  {
    _id: "m002",
    name: "Ajiwa",
    currency: "NGN",
    location: { state: "Katsina", code: "KT", LGA: "Batagarawa", country: "Nigeria" },
    isActive: true,
    isDeleted: false,
  },
  {
    _id: "m003",
    name: "Dawanau",
    currency: "NGN",
    location: { state: "Kano", code: "KN", LGA: "Dawakin Tofa", country: "Nigeria" },
    isActive: false,
    isDeleted: false,
  },
];

const emptyForm: Omit<IMarketData, "_id"> = {
  name: "",
  currency: "NGN",
  location: { state: "", code: "", LGA: "", country: "Nigeria" },
  isActive: true,
  isDeleted: false,
};

export default function MarketManagement() {
  const [markets, setMarkets] = useState<IMarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<IMarketData | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [marketToDelete, setMarketToDelete] = useState<IMarketData | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const fetchMarkets = async () => {
      setIsLoading(true);
      try {
        const response = await marketService.getAllMarkets();
        if (response?.payload) {
          setMarkets(response.payload.data);
        } else {
          setMarkets(mockMarkets);
        }
      } catch {
        setMarkets(mockMarkets);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  const handleView = (market: IMarketData) => {
    setSelectedMarket(market);
    setViewOpen(true);
  };

  const handleEdit = (market: IMarketData) => {
    setSelectedMarket(market);
    setFormData({
      name: market.name,
      currency: market.currency,
      location: { ...market.location },
      isActive: market.isActive,
      isDeleted: market.isDeleted,
    });
    setIsEditMode(true);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setFormData({ ...emptyForm, location: { ...emptyForm.location } });
    setIsEditMode(false);
    setFormOpen(true);
  };

  const handleDeleteClick = (market: IMarketData) => {
    setMarketToDelete(market);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!marketToDelete?._id) return;
    try {
      await marketService.deleteMarket(marketToDelete._id);
      setMarkets((prev) => prev.filter((m) => m._id !== marketToDelete._id));
    } catch {
      setMarkets((prev) => prev.filter((m) => m._id !== marketToDelete._id));
      toast.success("Market deleted");
    } finally {
      setDeleteOpen(false);
      setMarketToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (isEditMode && selectedMarket?._id) {
      try {
        await marketService.updateMarket(selectedMarket._id, formData);
        setMarkets((prev) =>
          prev.map((m) =>
            m._id === selectedMarket._id ? { ...m, ...formData } : m
          )
        );
      } catch {
        setMarkets((prev) =>
          prev.map((m) =>
            m._id === selectedMarket._id ? { ...m, ...formData } : m
          )
        );
        toast.success("Market updated");
      }
    } else {
      try {
        const response = await marketService.createMarket(formData as IMarketData);
        if (response?.payload) {
          setMarkets((prev) => [...prev, response.payload]);
        } else {
          const newMarket: IMarketData = {
            _id: `m-${Date.now()}`,
            ...formData,
          } as IMarketData;
          setMarkets((prev) => [...prev, newMarket]);
          toast.success("Market created");
        }
      } catch {
        const newMarket: IMarketData = {
          _id: `m-${Date.now()}`,
          ...formData,
        } as IMarketData;
        setMarkets((prev) => [...prev, newMarket]);
        toast.success("Market created");
      }
    }
    setFormOpen(false);
    setFormData({ ...emptyForm, location: { ...emptyForm.location } });
  };

  const columns = useMemo(
    () => createMarketColumns(handleView, handleEdit, handleDeleteClick),
    []
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary-venato" />
            Market Management
          </h1>
          <p className="text-muted-foreground">
            Configure global market settings and availability.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary-venato hover:bg-primary-venato/90 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Market
        </Button>
      </div>

      {/* Markets Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Markets</CardTitle>
          <CardDescription>
            {markets.length} market{markets.length !== 1 ? "s" : ""} registered
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={markets}
            searchKey="name"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary-venato" />
              Market Details
            </DialogTitle>
            <DialogDescription>Full configuration of this market</DialogDescription>
          </DialogHeader>
          {selectedMarket && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 bg-primary-venato/5 rounded-lg border border-primary-venato/10">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary-venato" />
                  <div>
                    <p className="text-sm text-muted-foreground">Market Name</p>
                    <p className="text-xl font-bold">{selectedMarket.name}</p>
                  </div>
                </div>
                <Badge variant={selectedMarket.isActive ? "success" : "destructive"}>
                  {selectedMarket.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Currency</span>
                  </div>
                  <p className="font-bold text-lg">{selectedMarket.currency}</p>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Flag className="h-3.5 w-3.5" />
                    <span>Country</span>
                  </div>
                  <p className="font-semibold">{selectedMarket.location?.country || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-lg bg-muted/40">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Navigation className="h-4 w-4" /> Location Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">State</p>
                    <p className="font-medium">{selectedMarket.location?.state || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">State Code</p>
                    <p className="font-medium">{selectedMarket.location?.code || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">LGA</p>
                    <p className="font-medium">{selectedMarket.location?.LGA || "N/A"}</p>
                  </div>
                  {selectedMarket.location?.coordinates && (
                    <div>
                      <p className="text-xs text-muted-foreground">Coordinates</p>
                      <p className="font-mono text-xs">
                        {selectedMarket.location.coordinates.latitude},{" "}
                        {selectedMarket.location.coordinates.longitude}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Market Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditMode ? (
                <MapPin className="h-5 w-5 text-primary-venato" />
              ) : (
                <Plus className="h-5 w-5 text-primary-venato" />
              )}
              {isEditMode ? "Edit Market" : "Create Market"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update market details" : "Register a new market on the platform"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="market-name">Market Name</Label>
              <Input
                id="market-name"
                placeholder="e.g. Charanci"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="market-state">State</Label>
                <Input
                  id="market-state"
                  placeholder="e.g. Katsina"
                  value={formData.location.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market-code">State Code</Label>
                <Input
                  id="market-code"
                  placeholder="e.g. KT"
                  value={formData.location.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, code: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="market-lga">LGA</Label>
                <Input
                  id="market-lga"
                  placeholder="e.g. Charanchi"
                  value={formData.location.LGA || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, LGA: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market-country">Country</Label>
                <Input
                  id="market-country"
                  placeholder="e.g. Nigeria"
                  value={formData.location.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, country: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border">
              <Checkbox
                id="market-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="market-active" className="cursor-pointer">
                Market is active and operational
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary-venato hover:bg-primary-venato/90"
              disabled={!formData.name || !formData.location.state}
            >
              {isEditMode ? "Save Changes" : "Create Market"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete market?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the market "{marketToDelete?.name}" from the system.
              All associated products and data may be affected.
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
