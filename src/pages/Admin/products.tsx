import {Button} from "@/components/ui/button";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {ICategory, IUnit, MarketNames} from "@/types/market.types";
import {type Products} from "@/types/products";
import {Eye, MapPin, Plus, Scale, Search, Tag, TrendingUp,X,DollarSign,Package,Box,Layers,Trash2,PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import ProductView from "@/components/ui/prodcutView";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export const products: Products[] = [
  {
    id: "p001",
    name: "Rice",
    price: 25000,
    unit: IUnit.TIYA,
    category: ICategory.Grains,
    market: MarketNames.Charanci,
    created_at: new Date("2025-12-01T10:00:00"),
    update_at: new Date("2025-12-01T10:00:00"),
  },
  {
    id: "p002",
    name: "Beans",
    price: 20000,
    unit: IUnit.TIYA,
    category: ICategory.LegumesAndNuts,
    market: MarketNames.Ajiwa,
    created_at: new Date("2025-12-02T09:30:00"),
    update_at: new Date("2025-12-02T09:30:00"),
  },
  {
    id: "p003",
    name: "Tomatoes",
    price: 5000,
    unit: IUnit.MUDU,
    category: ICategory.Vegetables,
    market: MarketNames.Charanci,
    created_at: new Date("2025-12-03T11:15:00"),
    update_at: new Date("2025-12-03T11:15:00"),
  },
  {
    id: "p004",
    name: "Onions",
    price: 4500,
    unit: IUnit.MUDU,
    category: ICategory.Vegetables,
    market: MarketNames.Dawanau,
    created_at: new Date("2025-12-04T08:45:00"),
    update_at: new Date("2025-12-04T08:45:00"),
  },
  {
    id: "p005",
    name: "Palm Oil",
    price: 1500,
    unit: IUnit.LITRE,
    category: ICategory.OilsAndSeeds,
    market: MarketNames.Ajiwa,
    created_at: new Date("2025-12-05T10:30:00"),
    update_at: new Date("2025-12-05T10:30:00"),
  },
  {
    id: "p006",
    name: "Vegetable Oil",
    price: 1200,
    unit: IUnit.LITRE,
    category: ICategory.OilsAndSeeds,
    market: MarketNames.Dawanau,
    created_at: new Date("2025-12-06T14:00:00"),
    update_at: new Date("2025-12-06T14:00:00"),
  },
  {
    id: "p007",
    name: "Sugar",
    price: 7000,
    unit: IUnit.TIYA,
    category: ICategory.Grains,
    market: MarketNames.Charanci,
    created_at: new Date("2025-12-07T12:20:00"),
    update_at: new Date("2025-12-07T12:20:00"),
  },
  {
    id: "p008",
    name: "Yam",
    price: 8000,
    unit: IUnit.TIYA,
    category: ICategory.RootsAndTubers,
    market: MarketNames.Ajiwa,
    created_at: new Date("2025-12-08T09:50:00"),
    update_at: new Date("2025-12-08T09:50:00"),
  },
  {
    id: "p009",
    name: "Mango",
    price: 4000,
    unit: IUnit.MUDU,
    category: ICategory.Fruits,
    market: MarketNames.Dawanau,
    created_at: new Date("2025-12-09T11:10:00"),
    update_at: new Date("2025-12-09T11:10:00"),
  },
  {
    id: "p010",
    name: "Groundnuts",
    price: 3000,
    unit: IUnit.TIYA,
    category: ICategory.LegumesAndNuts,
    market: MarketNames.Charanci,
    created_at: new Date("2025-12-10T10:05:00"),
    update_at: new Date("2025-12-10T10:05:00"),
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function Product() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [viewDetail,setShowDetails] = useState<boolean>(false)
  const [view,setView] = useState<Products| null>(null)
  const [addProduct,setAddProduct] = useState<Products | null >(null)
  const [productView,setProductView] = useState<boolean>(false)
  const[editView,setEditView] = useState<boolean>(false)
  const[editProductData,setEditProductData] = useState<Products | null>(null)
  const[updateProductData,setUpdateProductData] = useState<Products | null>(null)
  const editProductHandler = (product:Products)=>{
    setEditView(true)
    setEditProductData(product)
  }

  const productViewHandler = ()=>{
    setProductView(true)
  }
    console.log("Kick",addProduct)
  const closeProductView =()=>{
    setProductView(false)
  }

  const showDetails = (product:Products)=>{
     setShowDetails(true)
     setView(product)

  }

  const handleDelete = (id:string)=>{
    setFilteredProducts(f => f.filter(product=>product.id !== id))
    toast.success("Product deleted successfully")
  }
  const closeDetails = ()=>{
    setShowDetails(false)
    setView(null)
  }
  useEffect(()=>{
       const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if(searchQuery === ''){
      setFilteredProducts([...products]);
      return
    }
    console.log("Checking",filteredProducts)

    setFilteredProducts(filtered);
  },[searchQuery])
  return (
    <div className="p-7 container mx-auto max-w-7xl animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Market Inventory</h1>
          <p className="text-muted-foreground">Manage and track product prices across different markets.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-venato transition-colors" />
            <Input className="pl-9 h-11 bg-background" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}  placeholder="Search product name or category..." />
          </div>
          <Button onClick={()=>setProductView(true)} className="bg-primary-venato hover:bg-primary-venato/90 h-11 px-6 shadow-md transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        { filteredProducts && filteredProducts.length > 0 ? filteredProducts.map((product,id) => (
          <Card
            key={id}
            className="group relative overflow-hidden border-border/50 bg-card hover:border-primary-venato/40 hover:shadow-2xl hover:shadow-primary-venato/5 transition-all duration-300 ease-out flex flex-col"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Tag className="h-12 w-12 -rotate-12" />
            </div>

            <CardHeader className="pb-3 relative space-y-4">
              <div className="flex justify-between items-start pt-2">
                <div className="p-2.5 bg-primary-venato/10 rounded-xl text-primary-venato group-hover:bg-primary-venato group-hover:text-white transition-all duration-300">
                  <Tag className="h-5 w-5" />
                </div>
                <CardAction>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border/60">
                    {product.category}
                  </span>
                </CardAction>
              </div>
              <div>
                <CardTitle className="text-xl font-bold group-hover:text-primary-venato transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary-venato/70" />
                  <span className="text-muted-foreground">{product.market} Market</span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pb-4 flex-1">
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-2xl font-black text-foreground">
                  {formatPrice(product.price)}
                </span>
                <span className="text-muted-foreground text-xs font-semibold uppercase">
                  / {product.unit}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs py-2 px-1 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Scale className="h-3.5 w-3.5" />
                    <span>Unit Standard</span>
                  </div>
                  <span className="font-bold text-foreground">{product.unit}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 py-1.5 px-3 rounded-full border border-emerald-100/50 dark:border-emerald-900/50">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>MARKET TREND</span>
                  </div>
                  <span className="flex items-center gap-0.5 uppercase">+ Stable</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 px-6 flex justify-between items-center">
              <div>
<Button
                variant="outline"
                className="w-full h-11 border-border/60 hover:border-primary-venato hover:bg-primary-venato hover:text-white transition-all duration-300 rounded-xl font-semibold shadow-sm group-hover:shadow-md active:scale-[0.98]"
                onClick={()=>showDetails(product)}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Button>
              </div>

              <div className="flex items-center gap-3">
               <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" size="icon">
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete product?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. The product will be permanently removed.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-red-600 hover:bg-red-700"
        onClick={() => handleDelete(product.id)}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                <PencilLine className="mr-2 h-4 w-4 cursor-pointer text-green-500 hover:text-red-600 transition-colors  " onClick={()=>editProductHandler(product)} size={50}/>
              </div>
            </CardFooter>
          </Card>
        )): <p>No products found</p>
      }

      {
        viewDetail && view ? (
       <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
  <Card className="w-full max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-white">
    {/* Header */}
    <CardHeader>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary-venato" />
          <CardTitle className="text-xl font-bold">Product Details</CardTitle>
        </div>
        <Button variant="outline" onClick={() => setShowDetails(false)} className="p-2">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <CardDescription className="text-sm text-gray-500">
        View and manage product details
      </CardDescription>
    </CardHeader>

    {/* Content */}
    <CardContent className="mt-4 space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-gray-400" />
        <span className="font-medium">Product Name:</span>
        <span className="ml-auto font-semibold">{view.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <Box className="h-5 w-5 text-gray-400" />
        <span className="font-medium">Product Unit:</span>
        <span className="ml-auto font-semibold">{view.unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-gray-400" />
        <span className="font-medium">Product Category:</span>
        <span className="ml-auto font-semibold">{view.category}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-gray-400" />
        <span className="font-medium">Product Market:</span>
        <span className="ml-auto font-semibold">{view.market}</span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-gray-400" />
        <span className="font-medium">Product Price:</span>
        <span className="ml-auto font-semibold">{view.price}</span>
      </div>
    </CardContent>
  </Card>
</div >
        ):''
      }


        {
          productView || editView ? (

              <ProductView onclose={editView ? ()=>setEditView(false) : ()=>setProductView(false)} addProductVal = {(product)=>setFilteredProducts(p => [...p,product])} editView={editView} editProduct={editView ? editProductData : null} updateProductVal={(product)=>setUpdateProductData(p => ({
                ...p,
                id:product.id,
                price:product.price,
                unit:product.unit,
                category:product.category,
                market:product.market,
                name:product.name,
                created_at: product.created_at ?? new Date(),
                update_at: new Date(),
              }))} />

          ) : ''
}

      </div>
    </div>
  )
}
