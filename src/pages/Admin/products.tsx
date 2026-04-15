import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Plus,
  Tag,
  DollarSign,
  Box,
  Layers,
  MapPin,
  Calendar,
  Package,
} from "lucide-react";
import { createProductColumns } from "./columns/product-columns";
import { type Products } from "@/types/products";
import { IUnit, ICategory, MarketNames } from "@/types/market.types";
import ProductView from "@/components/ui/prodcutView";
import { useProductHook } from "./admin-hooks";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import type { IMarketProduct } from "@/types/market.types";

// Mock data
// const mockProducts: Products[] = [
//   {
//     id: "p001",
//     name: "Rice",
//     price: 25000,
//     unit: IUnit.TIYA,
//     category: ICategory.Grains,
//     market: MarketNames.Charanci,
//     created_at: new Date("2025-12-01T10:00:00"),
//     update_at: new Date("2025-12-01T10:00:00"),
//   },
//   {
//     id: "p002",
//     name: "Beans",
//     price: 20000,
//     unit: IUnit.TIYA,
//     category: ICategory.LegumesAndNuts,
//     market: MarketNames.Ajiwa,
//     created_at: new Date("2025-12-02T09:30:00"),
//     update_at: new Date("2025-12-02T09:30:00"),
//   },
//   {
//     id: "p003",
//     name: "Tomatoes",
//     price: 5000,
//     unit: IUnit.MUDU,
//     category: ICategory.Vegetables,
//     market: MarketNames.Charanci,
//     created_at: new Date("2025-12-03T11:15:00"),
//     update_at: new Date("2025-12-03T11:15:00"),
//   },
//   {
//     id: "p004",
//     name: "Onions",
//     price: 4500,
//     unit: IUnit.MUDU,
//     category: ICategory.Vegetables,
//     market: MarketNames.Dawanau,
//     created_at: new Date("2025-12-04T08:45:00"),
//     update_at: new Date("2025-12-04T08:45:00"),
//   },
//   {
//     id: "p005",
//     name: "Palm Oil",
//     price: 1500,
//     unit: IUnit.LITRE,
//     category: ICategory.OilsAndSeeds,
//     market: MarketNames.Ajiwa,
//     created_at: new Date("2025-12-05T10:30:00"),
//     update_at: new Date("2025-12-05T10:30:00"),
//   },
//   {
//     id: "p006",
//     name: "Vegetable Oil",
//     price: 1200,
//     unit: IUnit.LITRE,
//     category: ICategory.OilsAndSeeds,
//     market: MarketNames.Dawanau,
//     created_at: new Date("2025-12-06T14:00:00"),
//     update_at: new Date("2025-12-06T14:00:00"),
//   },
//   {
//     id: "p007",
//     name: "Sugar",
//     price: 7000,
//     unit: IUnit.TIYA,
//     category: ICategory.Grains,
//     market: MarketNames.Charanci,
//     created_at: new Date("2025-12-07T12:20:00"),
//     update_at: new Date("2025-12-07T12:20:00"),
//   },
//   {
//     id: "p008",
//     name: "Yam",
//     price: 8000,
//     unit: IUnit.TIYA,
//     category: ICategory.RootsAndTubers,
//     market: MarketNames.Ajiwa,
//     created_at: new Date("2025-12-08T09:50:00"),
//     update_at: new Date("2025-12-08T09:50:00"),
//   },
//   {
//     id: "p009",
//     name: "Mango",
//     price: 4000,
//     unit: IUnit.MUDU,
//     category: ICategory.Fruits,
//     market: MarketNames.Dawanau,
//     created_at: new Date("2025-12-09T11:10:00"),
//     update_at: new Date("2025-12-09T11:10:00"),
//   },
//   {
//     id: "p010",
//     name: "Groundnuts",
//     price: 3000,
//     unit: IUnit.TIYA,
//     category: ICategory.LegumesAndNuts,
//     market: MarketNames.Charanci,
//     created_at: new Date("2025-12-10T10:05:00"),
//     update_at: new Date("2025-12-10T10:05:00"),
//   },
// ];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

const initialProductState: Products = {
  _id: "",
  name: "",
  price: 0,
  unit: IUnit.TIYA,
  category: ICategory.Grains,
  market: {
    name: MarketNames.Charanci,
    _id: "",
    location: {
      state: "",
      code: "",
      LGA: "",
      cordinates: { longitude: "", latitude: "" }
    }
  },
  created_at: new Date(),
  update_at: new Date(),
};

export default function Product() {
  const { user } = useAuthStore();
  const { products, isLoading, markets, pagination, getProducts, createProduct, updateProducts, deleteProduct, fetchUserMarkets } = useProductHook();

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Products | null>(null);
  const [productViewOpen, setProductViewOpen] = useState(false);
  const [editView, setEditView] = useState(false);
  const [editProduct, setEditProduct] = useState<Products | null>(null);
  const [formProduct, setFormProduct] = useState<Products>(initialProductState);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  useEffect(() => {
    if (user?.userMarket && user.userMarket.length > 0) {
      fetchUserMarkets(user.userMarket);
    }
  }, [user, fetchUserMarkets]);



  const handleView = (product: Products) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleEdit = (product: Products) => {
    setEditProduct(product);
    setFormProduct(product);
    setEditView(true);
    setProductViewOpen(true);
  };

  const handleDeleteClick = (product: Products) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    console.log(productToDelete);
    const { success } = await deleteProduct(productToDelete._id, productToDelete.market._id);
    if (success) {
      setDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const handleAddProduct = () => {
    setEditView(false);
    setEditProduct(null);
    setFormProduct(initialProductState);
    setProductViewOpen(true);
  };

  const columns = useMemo(
    () => createProductColumns(handleView, handleEdit, handleDeleteClick),
    []
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in  fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Market Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage and track product prices across different markets.
          </p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="bg-primary-venato hover:bg-primary-venato/90 h-11 px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Product
        </Button>
      </div>

      {/* Products Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Products</CardTitle>
          <CardDescription>
            {products?.length} product{products?.length !== 1 ? "s" : ""} in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={products}
            searchKey="name"
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={(page:number) => getProducts(page, pagination.limit)}
            onPageSizeChange={(pageSize:number) => getProducts(1, pageSize)}
            pageSize={pagination.limit}
            pageCount={pagination.totalPages}
            onSearch={(search:string) => getProducts(1, 10, search)}
            pageIndex={pagination.currentPage}
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-venato" />
              Product Details
            </DialogTitle>
            <DialogDescription>View and manage product details</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-4 bg-primary-venato/5 rounded-lg border border-primary-venato/10">
                <Tag className="h-6 w-6 text-primary-venato" />
                <div>
                  <p className="text-sm text-muted-foreground">Product Name</p>
                  <p className="text-xl font-bold">{selectedProduct.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Price</span>
                  </div>
                  <p className="text-lg font-bold text-primary-venato">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
                <div className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Box className="h-3.5 w-3.5" />
                    <span>Unit</span>
                  </div>
                  <p className="font-semibold capitalize">{selectedProduct.unit}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold">{selectedProduct.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <MapPin className="h-5 w-5 text-primary-venato" />
                  <div>
                    <p className="text-sm text-muted-foreground">Market</p>
                    <p className="font-semibold">{selectedProduct.market.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedProduct.created_at).toLocaleDateString("en-NG", {
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

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product "{productToDelete?.name}" will be
              permanently removed.
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

      {/* Add/Edit Product View */}
      {productViewOpen && (
        <ProductView
          productVal={formProduct}
          markets={markets}
          onclose={() => {
            setProductViewOpen(false);
            setEditView(false);
            setEditProduct(null);
          }}
          addProductVal={async (product) => {
            console.log(product);
            const marketProduct: IMarketProduct = {
              name: product.name,
              unit: product.unit,
              price: product.price,
              category: product.category,
              marketId: product.market._id,
            };
            const { success } = await createProduct(marketProduct);
            if (success) {
              setProductViewOpen(false);
            }
          }}
          editView={editView}
          editProduct={editProduct}
          updateProductVal={async (product) => {
            const marketProduct: IMarketProduct = {
              name: product.name,
              unit: product.unit,
              price: product.price,
              category: product.category,
              marketId: product.market._id,
            };
            const { success } = await updateProducts(product._id, marketProduct);
            if (success) {
              setProductViewOpen(false);
              setEditView(false);
              setEditProduct(null);
            }
          }}
        />
      )}
    </div>
  );
}
