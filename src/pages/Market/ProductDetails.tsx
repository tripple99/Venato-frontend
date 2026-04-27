import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, ShieldCheck, Store } from "lucide-react";

import { images } from "@/assets/images";
import productService from "@/service/product.service";
import type { Product } from "@/model/product.model";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const response = await productService.getProductById(id);
          if (response?.payload) {
            setProduct(response.payload);
          }
        } catch (error) {
          console.error("Error fetching product details", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const productImages =
    product?.images && product.images.length > 0
      ? product.images
      : [images.productYam];

  const locationString = product?.market?.location
    ? typeof product.market.location === "string"
      ? product.market.location
      : `${product.market.location.state || ""}${
          product.market.location.country
            ? `, ${product.market.location.country}`
            : ""
        }`
    : "Unknown Location";

  return (
    <div className="w-full pt-28 p-7 flex flex-col pb-0 dark:bg-white bg-white min-h-screen">
      
      {/* ─── Back Navigation ─── */}
      <div className="w-full max-w-7xl cursor-pointer mb-5 mx-auto px-6 pt-10 pb-6 flex items-center">
        <Link to="/markets" className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-[#0D6449] transition-colors font-medium">
          <ArrowLeft size={18} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <section className="w-full max-w-7xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="w-full h-[400px] lg:h-[500px] rounded-3xl" />
            <div className="flex flex-col gap-6 pt-4">
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-16 w-1/3 rounded-md mt-4" />
              <Skeleton className="h-6 w-full rounded-md mt-2" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Image Carousel Container */}
            <div className="flex flex-col gap-4">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {productImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
                      >
                        <img
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Verified badge mapping */}
                        <div className="absolute top-6 left-6 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-black/5 text-xs font-bold text-gray-900 uppercase tracking-wider border border-white/40">
                          <ShieldCheck size={16} className="text-[#0D6449]" />
                          <span>Verified Harvest</span>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {productImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-900 border-none shadow-md" />
                    <CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-900 border-none shadow-md" />
                  </>
                )}
              </Carousel>

              {/* Thumbnails Slider */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 shadow-sm",
                        current === index
                          ? "border-[#0D6449] ring-2 ring-[#0D6449]/20"
                          : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border border-emerald-100">
                  {product.category || "General"}
                </span>
                {product.quantityAvailable > 0 ? (
                   <span className="text-gray-500 text-xs font-medium bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                     In Stock: {product.quantityAvailable} {product.unit}s
                   </span>
                ) : (
                   <span className="text-red-600 text-xs font-medium bg-red-50 px-3 py-1.5 rounded-md border border-red-100">
                     Out of Stock
                   </span>
                )}
              </div>

              <h1
                className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.1] mb-6"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-8 border-b border-gray-100 pb-8">
                <span className="text-5xl font-bold text-[#0D6449]">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: product.market?.currency || "NGN",
                    minimumFractionDigits: 0,
                  }).format(product.price || 0)}
                </span>
                <span className="text-lg text-gray-400 font-medium lowercase">
                  /{product.unit || "unit"}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                    <Store size={14} /> Origin Market
                  </div>
                  <span className="text-gray-900 font-semibold">{product.market?.name || "Multiple Markets"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                    <MapPin size={14} /> Location
                  </div>
                  <span className="text-gray-900 font-semibold">{locationString}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Premium quality harvest verified manually by Venato ground agents. Perfect for bulk processing or reselling. This product guarantees high yields and meets standard processing requirements."}
                </p>
              </div>

              {/* CTA */}
              {/* <div className="mt-auto pt-4 flex gap-4">
                <Button className="flex-1 bg-[#0D6449] hover:bg-[#0A503A] text-white rounded-xl py-6 text-lg font-semibold shadow-lg shadow-[#0D6449]/20 transition-all">
                  Initiate Trade
                </Button>
                <Button variant="outline" className="px-8 py-6 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all">
                   Contact Agent
                </Button>
              </div> */}

            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h3>
            <p className="text-gray-500 max-w-md">The product you are looking for does not exist or may have been removed.</p>
            <Link to="/markets" className="mt-6 text-[#0D6449] font-medium hover:underline">
              Return to Marketplace
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
