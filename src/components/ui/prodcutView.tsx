import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Products } from "@/types/products";
import { IUnit, ICategory, MarketNames } from "@/types/market.types";
import { type IMarketData } from "@/model/market.model";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Upload,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  unit: z.nativeEnum(IUnit),
  category: z.nativeEnum(ICategory),
  marketId: z.string().min(1, "Please select a market"),
  quantityAvailable: z.number().min(1, "Quantity must be at least 1"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductViewProps {
  onclose: (value: boolean) => void;
  addProductVal: (product: Products) => Promise<boolean>;
  productVal?: Products | null;
  markets: IMarketData[];
  editView?: boolean;
  isLoading?: boolean;
  editProduct?: Products | null;
  updateProductVal?: (product: Products) => Promise<boolean>;
}

export default function ProductView({
  onclose,
  addProductVal,
  isLoading = false,
  productVal,
  markets,
  editView = false,
  updateProductVal,
}: ProductViewProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: productVal?.name || "",
      price: productVal?.price || 0,
      unit: productVal?.unit || IUnit.TIYA,
      category: productVal?.category || ICategory.Grains,
      marketId: productVal?.market?._id || "",
      quantityAvailable: productVal?.quantityAvailable || 0,
    },
  });

  const [fileState, fileActions] = useFileUpload({
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    accept: "image/jpeg,image/png,image/jpg,image/webp",
    multiple: true,
    initialFiles:
      productVal?.images?.map((url, index) => ({
        id: url,
        name: `Image ${index + 1}`,
        size: 0,
        type: "image/url",
        url,
      })) || [],
  });

  useEffect(() => {
    if (productVal) {
      reset({
        name: productVal.name || "",
        price: productVal.price || 0,
        unit: productVal.unit || IUnit.TIYA,
        category: productVal.category || ICategory.Grains,
        marketId: productVal.market?._id || "",
        quantityAvailable: productVal.quantityAvailable || 0,
      });
    }
  }, [productVal, reset]);

  useEffect(() => {
    if (!editView && markets?.length === 1 && markets[0]._id) {
      setValue("marketId", markets[0]._id);
    }
  }, [markets, editView, setValue]);

  const onSubmit = async (data: ProductFormValues) => {
    if (isLoading) return;

    const selectedMarket = markets?.find((m) => m._id === data.marketId);

    if (!selectedMarket && !editView) {
      toast.error("Market data not found for selection");
      return;
    }

    const finalLocation =
      selectedMarket?.location || productVal?.market?.location;

    if (!finalLocation) {
      toast.error("Location information is missing");
      return;
    }

    const newImages = fileState.files
      .map((f) => f.file)
      .filter((f): f is File => f instanceof File);

    const retainedUrls = fileState.files
      .filter((f) => !(f.file instanceof File))
      .map((f) => f.preview || f.id)
      .filter(Boolean) as string[];

    const fullProduct: Products = {
      _id: productVal?._id || "",
      name: data.name,
      price: data.price,
      unit: data.unit,
      category: data.category,
      location: finalLocation,
      quantityAvailable: data.quantityAvailable,
      market: {
        _id: selectedMarket?._id || productVal?.market?._id || "",
        name: (selectedMarket?.name || productVal?.market?.name) as MarketNames,
        location: finalLocation,
      },
      image: newImages,
      images: retainedUrls,
      created_at: productVal?.created_at || new Date(),
      update_at: new Date(),
    };

    const success =
      editView && updateProductVal
        ? await updateProductVal(fullProduct)
        : await addProductVal(fullProduct);

    if (success) {
      onclose(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          onclose(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-venato/10 text-primary-venato">
              <Package className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold leading-tight">
                {editView ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {editView
                  ? "Update product details and images."
                  : "List a new product in your market inventory."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">
            {/* Product Name */}
            <div className="space-y-1.5">
              <Label htmlFor="product-name" className="text-sm font-medium">
                Product Name
              </Label>
              <Input
                id="product-name"
                {...register("name")}
                placeholder="e.g. Fresh Tomatoes"
                disabled={isLoading}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="product-price" className="text-sm font-medium">
                  Price (NGN)
                </Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="product-price"
                      prefix="₦"
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="0"
                      disabled={isLoading}
                      className={errors.price ? "border-destructive" : ""}
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="product-quantity"
                  className="text-sm font-medium"
                >
                  Quantity Available
                </Label>
                <Input
                  id="product-quantity"
                  type="number"
                  min={0}
                  {...register("quantityAvailable", { valueAsNumber: true })}
                  placeholder="0"
                  disabled={isLoading}
                  className={
                    errors.quantityAvailable ? "border-destructive" : ""
                  }
                />
                {errors.quantityAvailable && (
                  <p className="text-xs text-destructive">
                    {errors.quantityAvailable.message}
                  </p>
                )}
              </div>
            </div>

            {/* Unit & Category */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Unit</Label>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        type="button"
                        className={`w-full ${errors.unit ? "border-destructive" : ""}`}
                      >
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
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        type="button"
                        className={`w-full ${errors.category ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ICategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Market */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Market</Label>
              <Controller
                name="marketId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      type="button"
                      className={`w-full ${errors.marketId ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select a market" />
                    </SelectTrigger>
                    <SelectContent>
                      {markets?.map((market) => (
                        <SelectItem
                          key={market._id}
                          value={market._id || ""}
                        >
                          {market.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.marketId && (
                <p className="text-xs text-destructive">
                  {errors.marketId.message}
                </p>
              )}
            </div>

            {/* Product Images */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Images{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {fileState.files.length} / 5
                </span>
              </div>

              <div
                className={`flex items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-3.5 text-center transition-colors cursor-pointer ${
                  fileState.isDragging
                    ? "border-primary-venato bg-primary-venato/5"
                    : "border-border hover:border-primary-venato/60 hover:bg-muted/30"
                } ${
                  fileState.files.length >= 5 || isLoading
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onDragEnter={fileActions.handleDragEnter}
                onDragLeave={fileActions.handleDragLeave}
                onDragOver={fileActions.handleDragOver}
                onDrop={fileActions.handleDrop}
                onClick={fileActions.openFileDialog}
              >
                <input {...fileActions.getInputProps()} className="hidden" />
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-venato/10 text-primary-venato">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    Click or drag images to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 5MB each
                  </p>
                </div>
              </div>

              {fileState.files.length > 0 && (
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {fileState.files.map((file) => (
                    <div
                      key={file.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/30"
                    >
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <button
                        type="button"
                        aria-label="Remove image"
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          fileActions.removeFile(file.id);
                        }}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-90 transition-opacity hover:bg-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fileState.errors.length > 0 && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 space-y-0.5">
                  {fileState.errors.map((err, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-3.5 border-t bg-muted/20 shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onclose(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px] bg-primary-venato hover:bg-primary-venato-hover text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editView ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
