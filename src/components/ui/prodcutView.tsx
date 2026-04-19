import { type Products } from "@/types/products";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IUnit, ICategory, MarketNames } from "@/types/market.types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, X, DollarSign, Package, Box, Layers, Tag } from "lucide-react";
import { toast } from "sonner";
import { type IMarketData } from "@/model/market.model";
import { useFileUpload, formatBytes } from "@/hooks/use-file-upload";
import {
  Upload,
  ImageIcon,
  Trash2 as TrashIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
} from "@/components/reui/stepper";
import { useState } from "react";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  unit: z.nativeEnum(IUnit),
  category: z.nativeEnum(ICategory),
  marketId: z.string().min(1, "Please select a market"),
  quantityAvailable: z.number().min(1, "Quantity available must be at least 1"),
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
  isLoading,
  productVal,
  markets,
  editView = false,
  updateProductVal,
}: ProductViewProps) {
  const [activeStep, setActiveStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: productVal?.name || "",
      price: productVal?.price || 0,
      unit: productVal?.unit || IUnit.TIYA,
      category: productVal?.category || ICategory.Grains,
      marketId: productVal?.market._id || "",
    },
  });

  const [fileState, { clearFiles, ...fileActions }] = useFileUpload({
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: "image/jpeg,image/png,image/jpg,image/webp",
    multiple: true,
    initialFiles:
      productVal?.images?.map((url, index) => ({
        id: url, // Use URL as ID for existing images
        name: `Existing Image ${index + 1}`,
        size: 0,
        type: "image/url",
        url: url,
      })) || [],
  });

  useEffect(() => {
    if (productVal) {
      reset({
        name: productVal.name,
        price: productVal.price,
        unit: productVal.unit,
        category: productVal.category,
        marketId: productVal.market._id,
        quantityAvailable: productVal.quantityAvailable,
      });

      // Reset files if editing
      if (productVal.images) {
        clearFiles();
      }
    }
  }, [productVal, reset, clearFiles]);

  // Auto-select if only one market is available
  useEffect(() => {
    if (!editView && markets?.length === 1 && markets[0]._id) {
      setValue("marketId", markets[0]._id);
    }
  }, [markets, editView, setValue]);

  const onSubmit = async(data: ProductFormValues) => {
    // Architectural guard: Never trigger endpoint on step 1
    if (activeStep !== 2) return;

    const selectedMarket = markets?.find((m) => m._id === data.marketId);

    if (!selectedMarket && !editView) {
      toast.error("Market data not found for selection");
      return;
    }

    const finalLocation =
      selectedMarket?.location || productVal?.market.location;

    if (!finalLocation) {
      toast.error("Location information is missing");
      return;
    }

    // Extract files from useFileUpload
    const newImages = fileState.files
      .map((f) => f.file)
      .filter((f) => f instanceof File) as File[];

    const fullProduct: Products = {
      _id: productVal?._id || "",
      name: data.name,
      price: data.price,
      unit: data.unit,
      category: data.category,
      location: finalLocation,
      quantityAvailable: data.quantityAvailable,
      market: {
        _id: selectedMarket?._id || productVal?.market._id || "",
        name: (selectedMarket?.name || productVal?.market.name) as MarketNames,
        location: finalLocation,
      },
      image: newImages, // New files for upload
      images: productVal?.images || [], // Existing URLs
      created_at: productVal?.created_at || new Date(),
      update_at: new Date(),
    };

    if (editView && updateProductVal) {
      await updateProductVal(fullProduct);
      onclose(false);
    } else {
      await addProductVal(fullProduct);
      onclose(false);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger([
      "name",
      "price",
      "unit",
      "category",
      "marketId",
      "quantityAvailable",
    ]);
    if (isValid) {
      setActiveStep(2);
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

    const handleFormAction = (data: ProductFormValues) => {
      if (activeStep === 1) {
        handleNext();
      } else {
        onSubmit(data);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
        <Card className="relative w-5/6 max-w-xl mx-auto rounded-2xl shadow-2xl bg-background border-border overflow-hidden transition-all duration-300">
          {isLoading && (
            <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
              <Loader2 className="h-10 w-10 text-primary-venato animate-spin mb-4" />
              <p className="text-lg font-bold text-foreground">Processing Product...</p>
              <p className="text-sm text-muted-foreground animate-pulse">
                {editView ? "Updating" : "Creating"} product data and media
              </p>
            </div>
          )}
          <form
            onSubmit={handleSubmit(handleFormAction)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && activeStep === 1) {
                e.preventDefault();
                handleSubmit(handleFormAction)();
              }
            }}
          >
            <CardHeader className="p-6 border-b bg-muted/30 dark:bg-muted/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-venato/10 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-primary-venato" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    {editView ? "Edit Product" : "Add Product"}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {editView
                      ? "Update product details & media"
                      : "List a new product in the market"}
                  </CardDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onclose(false)}
                className="h-9 w-9 p-0 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Stepper Navigation */}
            <Stepper
              value={activeStep}
              onValueChange={setActiveStep}
              className="mt-2"
            >
              <StepperNav>
                <StepperItem step={1} className="flex-1">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex flex-col items-center gap-1.5">
                      <StepperIndicator className="size-8">
                        {activeStep > 1 ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          1
                        )}
                      </StepperIndicator>
                      <StepperTitle className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                        Details
                      </StepperTitle>
                    </div>
                    <StepperSeparator className="flex-1" />
                  </div>
                </StepperItem>
                <StepperItem step={2} className="flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <StepperIndicator className="size-8">2</StepperIndicator>
                    <StepperTitle className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                      Media
                    </StepperTitle>
                  </div>
                </StepperItem>
              </StepperNav>
            </Stepper>
          </CardHeader>

          <CardContent className="p-0 scrollbar-hide max-h-[60vh] overflow-y-auto">
            <Stepper value={activeStep}>
              {/* STEP 1: PRODUCT DETAILS */}
              <StepperContent
                value={1}
                className="p-6 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="grid gap-5">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4 text-primary-venato/70" /> Product
                      Name
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="e.g. Fresh Tomatoes"
                      className={`bg-muted/30 focus-visible:ring-primary-venato transition-all ${errors.name ? "border-destructive ring-destructive/20" : "border-border"}`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-destructive font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Product Price */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4 text-primary-venato/70" />{" "}
                      Price (NGN)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="0"
                      className={`bg-muted/30 focus-visible:ring-primary-venato transition-all ${errors.price ? "border-destructive ring-destructive/20" : "border-border"}`}
                    />
                    {errors.price && (
                      <p className="text-[11px] text-destructive font-medium">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                   {/* Product Market */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-venato/70" />{" "}
                      Market Location
                    </Label>
                    <Controller
                      name="marketId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            type="button"
                            className={`bg-muted/30 focus:ring-primary-venato transition-all ${errors.marketId ? "border-destructive" : "border-border"}`}
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
                  </div>
                  

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                    <Label
                      htmlFor="quantityAvailable"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <Box className="h-4 w-4 text-primary-venato/70" />{" "}
                      Quantity Available
                    </Label>
                    <Input
                      id="quantityAvailable"
                      type="number"
                      {...register("quantityAvailable", { valueAsNumber: true })}
                      placeholder="0"
                      className={`bg-muted/30 focus-visible:ring-primary-venato transition-all ${errors.quantityAvailable ? "border-destructive ring-destructive/20" : "border-border"}`}
                    />
                    {errors.quantityAvailable && (
                      <p className="text-[11px] text-destructive font-medium">
                        {errors.quantityAvailable.message}
                      </p>
                    )}
                  </div>
                    {/* Product Unit */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Box className="h-4 w-4 text-primary-venato/70" /> Unit
                      </Label>
                      <Controller
                        name="unit"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              type="button"
                              className={`bg-muted/30 focus:ring-primary-venato transition-all ${errors.unit ? "border-destructive" : "border-border"}`}
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

                    {/* Product Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary-venato/70" />{" "}
                        Category
                      </Label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              type="button"
                              className={`bg-muted/30 focus:ring-primary-venato transition-all ${errors.category ? "border-destructive" : "border-border"}`}
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
                
          
                 
                </div>
              </StepperContent>

              {/* STEP 2: MEDIA UPLOAD */}
              <StepperContent
                value={2}
                className="p-6 space-y-6 animate-in fade-in slide-in-from-left-4 duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary-venato/70" />{" "}
                      Product Gallery
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter bg-muted px-2 py-0.5 rounded-full">
                      {fileState.files.length} / 5 Images
                    </span>
                  </div>

                  <div
                    className={`
                        border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
                        ${fileState.isDragging ? "border-primary-venato bg-primary-venato/5 scale-[0.98]" : "border-muted-foreground/20 hover:border-primary-venato/50 hover:bg-muted/20"}
                        ${fileState.files.length >= 5 ? "opacity-50 cursor-not-allowed pointer-events-none grayscale" : ""}
                      `}
                    onDragEnter={fileActions.handleDragEnter}
                    onDragLeave={fileActions.handleDragLeave}
                    onDragOver={fileActions.handleDragOver}
                    onDrop={fileActions.handleDrop}
                    onClick={fileActions.openFileDialog}
                  >
                    <input
                      {...fileActions.getInputProps()}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-primary-venato/10 p-4 rounded-full shadow-inner">
                        <Upload className="h-7 w-7 text-primary-venato" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">
                          Click or drag images
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 tracking-tight">
                          Support: PNG, JPG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selected Files List */}
                  {fileState.files.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 mt-4 max-h-[250px] overflow-y-auto scrollbar-hide pr-1">
                      {fileState.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-3 border border-border/50 rounded-xl bg-muted/20 dark:bg-muted/5 group hover:bg-muted/40 transition-colors"
                        >
                          <div className="h-14 w-14 overflow-hidden rounded-lg border border-border shadow-sm bg-background shrink-0">
                            {file.preview ? (
                              <img
                                src={file.preview}
                                alt="preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate leading-none mb-1">
                              {file.file.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              {file.file instanceof File
                                ? formatBytes(file.file.size)
                                : "Network Resource"}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileActions.removeFile(file.id);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {fileState.errors.length > 0 && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 animate-in shake duration-500">
                      {fileState.errors.map((err, i) => (
                        <p
                          key={i}
                          className="text-[11px] text-destructive font-bold"
                        >
                          {err}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </StepperContent>
            </Stepper>
          </CardContent>

          <CardFooter className="p-6 border-t bg-muted/30 dark:bg-muted/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {activeStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveStep(1)}
                  className="gap-2 font-semibold shadow-sm rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Details
                </Button>
              )}
              {activeStep === 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onclose(false)}
                  className="text-muted-foreground font-semibold"
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {activeStep === 1 ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="bg-primary-venato hover:bg-primary-venato-hover text-white gap-2 font-bold px-6 shadow-lg shadow-primary-venato/20 rounded-full"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || activeStep !== 2}
                  className="bg-primary-venato hover:bg-primary-venato-hover text-white gap-2 font-bold px-6 shadow-lg shadow-primary-venato/20 rounded-full"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      {editView ? "Update Product" : "Publish Product"}
                      <CheckCircle2 className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
