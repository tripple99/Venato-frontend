import { MapPin, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Product } from "@/model/product.model";
import { images } from "@/assets/images";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketHook } from "./market-hook";
import { toast } from "sonner";
interface ProductCardProps {
  product: Product;
  idx: number;
  onWatchListToggle?: (id: string) => void;
}

export function ProductCard({ product, idx, onWatchListToggle }: ProductCardProps) {
  
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : images.productYam;

  const locationString = product.market?.location
    ? typeof product.market.location === "string"
      ? product.market.location
      : `${product.market.location.state}`
    : "Unknown Location";
  const toWatchList = (id:string) => {
    try {
      if (onWatchListToggle) {
        onWatchListToggle(id);
        toast.success("Product added to watch list",{
          description:"You will be notified when the price changes",
          duration:5000,
        });
      }
    } catch (error) {
      console.error("Error adding to watch list:", error);
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.5 }}
      className="group bg-white rounded-3xl cursor-pointer w-full overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />

        {/* No gradient overlay to keep images bright */}

        {/* Verified badge */}
        <div className="absolute top-3 left-3 bg-white/10 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-semibold shadow">
          <ShieldCheck size={12} className="text-primary-venato text-sm" />
          <span className="text-sm">Verified</span>
        </div>

        {/* Watchlist */}
        <button
          onClick={() => toWatchList(product._id)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
        >
          <Heart
            size={16}
            className={`transition ${
              product.isWatched ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Title + price */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {product.name}
          </h3>

          <div className="text-right shrink-0">
            <p className="font-bold text-green-700 text-lg leading-none">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: product.market?.currency || "NGN",
                minimumFractionDigits: 0,
              }).format(product.price || 0)}
            </p>
            <span className="text-[11px] text-gray-400">
              /{product.unit || "unit"}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description ||
            "Fresh harvest available for bulk processing. High yield, locally sourced."}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto">
          {/* Location */}
          <div className="flex items-center gap-1 text-gray-400 text-xs truncate max-w-[60%]">
            <MapPin size={14} />
            <span className="truncate">{locationString}</span>
          </div>

          {/* CTA */}
          <Link to={`/product/${product._id || ''}`}>
            <Button className="rounded-full px-4 py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white shadow-sm">
              Trade
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col animate-pulse">
      
      {/* Image */}
      <div className="relative h-52 w-full">
        <Skeleton className="h-full w-full" />

        {/* badge placeholder */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* heart placeholder */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        
        {/* Title + price */}
        <div className="flex justify-between items-start gap-3">
          <Skeleton className="h-5 w-2/3 rounded-md" />
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-3 w-10 rounded-md" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-center mt-auto">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}