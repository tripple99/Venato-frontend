import { MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Product } from "@/model/product.model";
import { images } from "@/assets/images";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
  idx: number;
}

export function ProductCard({ product, idx }: ProductCardProps) {
  // Use first image if available, else fallback to a placeholder/default
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : images.productYam;
  
  // Get location from nested market object
  const locationString = product.market?.location 
    ? typeof product.market.location === "string" 
      ? product.market.location 
      : `${product.market.location.state}, ${product.market.location.country}`
    : "Unknown Location";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group flex flex-col"
    >
      {/* Image & Badge */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <ShieldCheck size={14} className="text-[#0D6449]" />
          <span className="text-[9px] font-bold tracking-wider text-gray-800">VERIFIED TRADER</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 max-w-[60%] leading-tight capitalize truncate">
            {product.name}
          </h3>
          <div className="text-right">
            <span className="block font-bold text-lg text-gray-900 leading-none mb-1">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: product.market?.currency || "NGN",
                minimumFractionDigits: 0,
              }).format(product.price || 0)}
            </span>
            <span className="text-xs text-gray-400 font-medium tracking-wide">
              /{product.unit || "unit"}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-6 flex-1 line-clamp-3">
          {product.description || "Fresh harvest available for bulk processing. High yield, locally sourced."}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500 truncate max-w-[55%]">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="text-[11px] font-semibold truncate capitalize">{locationString}</span>
          </div>
          <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 rounded-md text-xs font-bold transition-colors">
            Trade Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
    </div>
  );
}
