import { type Products } from "@/types/products"
import { useState } from "react"
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { IUnit, ICategory, MarketNames } from "@/types/market.types";
import { Button } from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import {Eye, MapPin, Plus, Scale, Search, Tag, TrendingUp,X,DollarSign,Package,Box,Layers} from "lucide-react";
import { toast } from "sonner"

interface ProductViewProps{
    onclose:(value:boolean)=>void,
    addProductVal:(product:Products)=>void,
    editView?:boolean
    editProduct?:Products | null
    updateProductVal?:(product:Products)=>void
}
export default function ProductView({onclose,addProductVal,editView=false,editProduct,updateProductVal}:ProductViewProps){

        const [productVal,setProductVal ] = useState<Products>({
        id: editProduct?.id || "",
        name: editProduct?.name || "",
        price: editProduct?.price || 0,
        unit: editProduct?.unit || IUnit.TIYA,
        category: editProduct?.category || ICategory.Grains,
        market: editProduct?.market || MarketNames.Charanci,
        created_at: new Date(),
        update_at: new Date(),
    })
    const updateProduct = (product:Products)=>{
        productVal.id = product.id || editProduct?.id || ""
        productVal.name = product.name || editProduct?.name || ""
        productVal.price = product.price || editProduct?.price || 0
        productVal.unit = product.unit || editProduct?.unit || IUnit.TIYA
        productVal.category = product.category || editProduct?.category || ICategory.Grains
        productVal.market = product.market || editProduct?.market || MarketNames.Charanci
        productVal.created_at = product.created_at
        productVal.update_at = product.update_at
    }
    const handleUpdateProduct = ()=>{
      if(updateProductVal){
        updateProductVal(productVal)
        console.log("Updated product",productVal)
        toast.success("Your product has been successfully updated.")
        onclose(false)
      }
    }
  const handleAddProduct = ()=>{

   addProductVal(productVal)
   toast.success( "Your product has been successfully added.");
   onclose(false)
  }

    return(
        <div>
<div className="fixed inset-0 z-50 flex items-center  justify-center bg-black/50 p-3">
  <Card className="w-5/6  scroll-auto max-w-xl mx-auto  p-8 rounded-xl shadow-xl bg-white">
    <CardHeader className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary-venato" />
          <CardTitle className="text-3xl font-bold">{editView ? "Edit Product" : "Add Product"}</CardTitle>
        </div>
        <Button variant="outline" onClick={() => onclose(false)} className="p-2">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <CardDescription className="text-gray-500 mt-1">
        Fill in product details to add a new product
      </CardDescription>
    </CardHeader>

    <CardContent className="grid  gap-x-8 gap-y-6 w-full">
      {/* Product Name */}
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="product-name" className="flex items-center gap-1">
          <Tag className="h-5 w-5 text-gray-400" /> Name
        </Label>
        <Input
          id="product-name"
          type="text"
          placeholder="Product Name"
          value={productVal.name}
          onChange={(e) =>
            setProductVal({ ...productVal, name: e.target.value })
          }
        />
      </div>

      {/* Product Price */}
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="product-price" className="flex items-center gap-1">
          <DollarSign className="h-5 w-5 text-gray-400" /> Price
        </Label>
        <Input
          id="product-price"
          type="number"
          placeholder="Product Price"
          value={productVal.price}
          onChange={(e) =>
            setProductVal({ ...productVal, price: Number(e.target.value) })
          }
        />
      </div>

      {/* Product Unit */}
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="product-unit" className="flex items-center gap-1">
          <Box className="h-5 w-5 text-gray-400" /> Unit
        </Label>
        <Select value={productVal.unit} onValueChange={(value) => setProductVal({ ...productVal, unit: value as IUnit })}>
          <SelectTrigger id="product-unit" className="w-full">
            <SelectValue placeholder="Select a unit" />
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

      {/* Product Category */}
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="product-category" className="flex items-center gap-1">
          <Layers className="h-5 w-5 text-gray-400" /> Category
        </Label>
        <Select value={productVal.category} onValueChange={(value) => setProductVal({ ...productVal, category: value as ICategory })}>
          <SelectTrigger id="product-category" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ICategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Market */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-market" className="flex items-center gap-1">
          <MapPin className="h-5 w-5 text-gray-400" /> Market
        </Label>
        <Select value={productVal.market} onValueChange={(value) => setProductVal({ ...productVal, market: value as MarketNames })}>
          <SelectTrigger id="product-market" className="w-full">
            <SelectValue placeholder="Select a market" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {Object.values(MarketNames).map((market) => (
              <SelectItem key={market} value={market}>
                {market}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CardContent>

    <CardFooter className="mt-6 flex justify-end gap-4">
      <Button variant="outline" onClick={() => onclose(false)}>
        Close
      </Button>
      <Button variant="default" onClick={editView ? handleUpdateProduct : handleAddProduct}>
        {editView ? "Update Product" : "Add Product"}
      </Button>
    </CardFooter>
  </Card>
</div>


        </div>
    )
}