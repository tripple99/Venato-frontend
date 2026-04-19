import { useState, useEffect } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { images } from "@/assets/images";
import { Link } from "react-router-dom";

import { useMarketHook } from "./market-hook";
import { ProductCard, ProductCardSkeleton } from "./productCard";
import { MarketFilters } from "./filters";
// import { ShimmerTable } from "@/components/ui/shimmerTable";
import { useDebounce } from "@/hooks/useDebounce";
export default function Market() {
  const {
    isLoadingProducts,
    markets,
    fetchMarkets,
    products,
    productPagination,
    fetchProducts,
    loadMoreProducts,
    addToWatchList,
  } = useMarketHook();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMarketId, setActiveMarketId] = useState("all");
  const debounceSearch = useDebounce(searchTerm, 500);
  // Fetch initial products and listen for filter changes
  useEffect(() => {
    const filters: any = {};
    if (debounceSearch) filters.search = debounceSearch;
    if (activeCategory !== "all") filters.category = activeCategory;
    if (activeMarketId !== "all") filters.marketId = activeMarketId;

    fetchProducts(1, 12, filters);
  }, [activeCategory, activeMarketId, fetchProducts,debounceSearch]);
  
  useEffect(() => {
    fetchMarkets()
  }, [fetchMarkets]);
  const handleSearchSubmit = () => {
    const filters: any = {};
    if (debounceSearch) filters.search = debounceSearch;
    if (activeCategory !== "all") filters.category = activeCategory;
    if (activeMarketId !== "all") filters.marketId = activeMarketId;

    fetchProducts(1, 12, filters);
  };

  const handleLoadMore = () => {
    const filters: any = {};
    if (debounceSearch) filters.search = debounceSearch;
    if (activeCategory !== "all") filters.category = activeCategory;
    if (activeMarketId !== "all") filters.marketId = activeMarketId;

    loadMoreProducts(filters);
  };
 console.log(markets,"markets")
  return (
    <div className="w-full flex flex-col pb-0 dark:bg-white">
      {/* ─── HERO SECTION ─── */}
      <section className="relative w-full h-[360px] sm:h-[450px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={images.marketBanner}
            alt="Vibrant Nigerian Market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center mt-[-40px]"
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/90 mb-3 drop-shadow-md">
            Heritage & Trust
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8 drop-shadow-lg text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Venato Harvest
          </h1>

          {/* Search Box */}
          <div className="w-full max-w-2xl bg-white p-2 rounded-xl shadow-2xl flex items-center gap-2 transition-shadow focus-within:ring-2 focus-within:ring-[#0D6449]/50">
            <div className="pl-4 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder="Search for grains, roots, or verified traders..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 px-2 py-3"
            />
            <Button 
              onClick={handleSearchSubmit}
              className="bg-[#0D6449] hover:bg-[#0A503A] text-white px-8 py-6 rounded-lg font-semibold h-full transition-all"
            >
              Search
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ─── QUICK FILTERS & COMPONENT ─── */}
      <MarketFilters 
        markets={markets}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeMarketId={activeMarketId}
        onMarketChange={setActiveMarketId}
      />

      {/* ─── MARKETPLACE GRID ─── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 dark:bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between  mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 block">
              Marketplace
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Verified Direct Sources
            </h2>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {isLoadingProducts && products.length === 0 ? "Loading harvests..." : `Found ${productPagination.totalCount} reliable harvests`}
          </span>
        </div>

        {/* Loading State or Grid */}
        {isLoadingProducts && products.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <ProductCard 
                  key={`${product._id}-${idx}`} 
                  product={product} 
                  idx={idx} 
                  onWatchListToggle={addToWatchList} 
                />
              ))}
            </div>

            {/* Load More Button */}
            {productPagination.hasNextPage && (
              <div className="flex justify-center mt-12">
                <Button 
                  onClick={handleLoadMore}
                  disabled={isLoadingProducts}
                  variant="outline" 
                  className="bg-gray-50 cursor-pointer   text-[#0D6449] hover:text-primary-venato font-bold px-8 py-6 rounded-xl flex items-center gap-2"
                >
                  {isLoadingProducts ? "Loading..." : "Load More Products"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Harvests Found</h3>
            <p className="text-sm text-gray-500 max-w-md mt-2">
              We couldn't find any products matching your selected filters. Try adjusting your search query or selecting a different market.
            </p>
            <Button 
              variant="outline" 
              className="mt-6 border-gray-300"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
                setActiveMarketId("all");
                fetchProducts(1, 12, {});
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* ─── OUR PROMISE SECTION ─── */}
      <section className="w-full bg-white border-t border-gray-100 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col"
          >
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">
              Our Promise
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              The Architect of Fair Trade
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mb-12">
              Every listing on Venato is physically verified by our ground agents. We ensure the heritage of your food is preserved through transparent, traceable pricing and secure logistics.
            </p>

            <div className="flex gap-8 sm:gap-12 flex-wrap">
              <div>
                <span className="block text-3xl font-bold text-gray-900 mb-1">12k+</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Verified Traders</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-gray-900 mb-1">₦2.4B</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Traded Annually</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-gray-900 mb-1">100%</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Payment Security</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[500px] w-full max-w-lg mx-auto lg:ml-auto select-none"
          >
            <img 
              src={images.marketGlobe} 
              alt="Digital globe hologram" 
              className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(16,185,129,0.3)]"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-8 -left-4 sm:left-4 bg-white p-6 rounded-2xl shadow-2xl max-w-[240px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#0D6449]/10 flex items-center justify-center mb-4">
                <ShieldCheck size={20} className="text-[#0D6449]" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Heritage Guarantee</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                We provide full traceability for every bag sold on our platform.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full bg-[#f4f5f5] pt-20 pb-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-6 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              The Earth's Architect
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Built for the hands that feed nations. Modern tools for ancient traditions.
            </p>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-5">Market Intel</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Daily Price Index</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Harvest Forecasts</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Logistics Map</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-5">Trust & Safety</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Verified Trader Program</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Dispute Resolution</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Escrow Payments</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Farmer Hub</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Trade Support</Link></li>
              <li><Link to="#" className="text-xs text-gray-500 hover:text-[#0D6449] transition">Contact Agent</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            © {new Date().getFullYear()} Venato Prime. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-900 transition">Privacy Policy</Link>
            <Link to="#" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-900 transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
