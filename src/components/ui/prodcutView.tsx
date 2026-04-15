import { type Products } from "@/types/products"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { IUnit, ICategory, MarketNames } from "@/types/market.types";
import { Button } from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import { MapPin, X, DollarSign, Package, Box, Layers, Tag } from "lucide-react";
import { toast } from "sonner"
import { type IMarketData } from "@/model/market.model";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  unit: z.nativeEnum(IUnit),
  category: z.nativeEnum(ICategory),
  marketId: z.string().min(1, "Please select a market"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductViewProps {
    onclose: (value: boolean) => void,
    addProductVal: (product: Products) => void,
    productVal?: Products | null,
    markets: IMarketData[],
    editView?: boolean
    editProduct?: Products | null
    updateProductVal?: (product: Products) => void
}

export default function ProductView({ onclose, addProductVal, productVal, markets, editView = false, updateProductVal }: ProductViewProps) {
    
    const {
      register,
      handleSubmit,
      control,
      reset,
      setValue,
      formState: { errors, isSubmitting },
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

    useEffect(() => {
      if (productVal) {
        reset({
          name: productVal.name,
          price: productVal.price,
          unit: productVal.unit,
          category: productVal.category,
          marketId: productVal.market._id,
        });
      }
    }, [productVal, reset]);

    // Auto-select if only one market is available
    useEffect(() => {
      if (!editView && markets?.length === 1 && markets[0]._id) {
        setValue("marketId", markets[0]._id);
      }
    }, [markets, editView, setValue]);

    const onSubmit = (data: ProductFormValues) => {
      const selectedMarket = markets?.find(m => m._id === data.marketId);
      
      if (!selectedMarket && !editView) {
        toast.error("Market data not found for selection");
        return;
      }

      const fullProduct: Products = {
        _id: productVal?._id || "",
        name: data.name,
        price: data.price,
        unit: data.unit,
        category: data.category,
        market: {
          _id: selectedMarket?._id || productVal?.market._id || "",
          name: (selectedMarket?.name || productVal?.market.name) as MarketNames,
          location: selectedMarket?.location || productVal?.market.location,
        },
        created_at: productVal?.created_at || new Date(),
        update_at: new Date(),
      };

      if (editView && updateProductVal) {
        updateProductVal(fullProduct);
      } else {
        addProductVal(fullProduct);
      }
      onclose(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
        <Card className="w-5/6 max-w-xl mx-auto rounded-xl shadow-xl bg-white overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary-venato" />
                  <CardTitle className="text-2xl font-bold">{editView ? "Edit Product" : "Add Product"}</CardTitle>
                </div>
                <Button type="button" variant="ghost" onClick={() => onclose(false)} className="h-8 w-8 p-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <CardDescription className="mt-1">
                {editView ? "Update product details" : "Fill in product details to add a new product"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Product Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="flex items-center gap-1.5 font-medium">
                  <Tag className="h-4 w-4 text-gray-500" /> Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. Fresh Tomatoes"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Product Price */}
              <div className="space-y-1.5">
                <Label htmlFor="price" className="flex items-center gap-1.5 font-medium">
                  <DollarSign className="h-4 w-4 text-gray-500" /> Price (NGN)
                </Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Product Unit */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 font-medium">
                    <Box className="h-4 w-4 text-gray-500" /> Unit
                  </Label>
                  <Controller
                    name="unit"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.unit ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(IUnit).map((unit) => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.unit && <p className="text-xs text-red-500">{errors.unit.message}</p>}
                </div>

                {/* Product Category */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 font-medium">
                    <Layers className="h-4 w-4 text-gray-500" /> Category
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ICategory).map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>
              </div>

              {/* Product Market */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-gray-500" /> Market
                </Label>
                <Controller
                  name="marketId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.marketId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a market" />
                      </SelectTrigger>
                      <SelectContent>
                        {markets?.map((market) => (
                          <SelectItem key={market._id} value={market._id || ""}>
                            {market.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.marketId && <p className="text-xs text-red-500">{errors.marketId.message}</p>}
              </div>
            </CardContent>

            <CardFooter className="p-6 border-t flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onclose(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary-venato hover:bg-primary-venato/90 cursor-pointer"
              >
                {isSubmitting ? "Processing..." : (editView ? "Update Product" : "Add Product")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
}
