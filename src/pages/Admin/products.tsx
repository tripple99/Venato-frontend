import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
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
import { useAuthStore } from "@/store/authStore";
import type { IMarketProduct } from "@/types/market.types";
import { type ILocation } from "@/model/market.model";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

const initialLocation: ILocation = {
  state: "",
  code: "",
  LGA: "",
  country: "Nigeria",
  coordinates: { longitude: "", latitude: "" }
};

const initialProductState: Products = {
  _id: "",
  name: "",
  price: 0,
  unit: IUnit.TIYA,
  category: ICategory.Grains,
  quantityAvailable:0,
  location: initialLocation,
  market: {
    name: MarketNames.Charanci,
    _id: "",
    location: initialLocation
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
          isLoading={isSubmitting}
          onclose={() => {
            setProductViewOpen(false);
            setEditView(false);
            setEditProduct(null);
            setIsSubmitting(false);
          }}
          addProductVal={async (product) => {
            const marketProduct: IMarketProduct = {
              name: product.name,
              unit: product.unit,
              price: product.price,
              category: product.category,
              marketId: product.market._id,
              quantityAvailable: product.quantityAvailable,
              image: product.image,
            };
            setIsSubmitting(true);
            const { success } = await createProduct(marketProduct);
            if (success) {
              setIsSubmitting(false);
              setProductViewOpen(false);
              return true;
            }
            setIsSubmitting(false);
            return false;
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
              quantityAvailable: product.quantityAvailable,
              images: product.images, // PRESERVE EXISTING IMAGES
              image: product.image,  // ADD NEW IMAGES
            };
            const { success } = await updateProducts(product._id, marketProduct);
            if (success) {
              setProductViewOpen(false);
              setEditView(false);
              setEditProduct(null);
              return true;
            }
            return false;
          }}
        />
      )}
    </div>
  );
}
