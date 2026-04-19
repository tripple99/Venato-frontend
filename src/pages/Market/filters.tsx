import { SlidersHorizontal } from "lucide-react";
import { type IMarketData } from "@/model/market.model";
import { ICategory } from "@/types/market.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketFiltersProps {
  markets: IMarketData[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeMarketId: string;
  onMarketChange: (marketId: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: ICategory.Grains, label: "Grains" },
  { id: ICategory.LegumesAndNuts, label: "Legumes" },
  { id: ICategory.Vegetables, label: "Vegetables" },
  { id: ICategory.OilsAndSeeds, label: "Oils & Seeds" },
  { id: ICategory.Livestock, label: "Livestock" },
  { id: ICategory.RootsAndTubers, label: "Roots and Tubers" },
  { id: ICategory.Fruits, label: "Fruit" },
  { id: ICategory.Spices, label: "Spices" },
  { id: ICategory.Others, label: "Others" },
];

export function MarketFilters({
  markets,
  activeCategory,
  onCategoryChange,
  activeMarketId,
  onMarketChange,
}: MarketFiltersProps) {
  return (
    <div className="w-full px-6 max-w-7xl mx-auto -mt-8 relative z-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Category Quick Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-1 min-w-[300px]">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 whitespace-nowrap">
            Quick Filters:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-full whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? "bg-[#0D6449] text-white shadow-md shadow-[#0D6449]/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters (Market Selection) */}
        <div className="flex items-center gap-2 border-l border-gray-100 pl-4 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-black" />
          <span className="text-xs font-semibold text-black whitespace-nowrap mr-2">
            Filter by Market:
          </span>
          <Select value={activeMarketId} onValueChange={onMarketChange} >
            <SelectTrigger className="w-[180px] h-9 text-xs border-gray-200 focus:ring-[#0D6449]">
              <SelectValue placeholder="All Markets" className="text-black" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              {markets.map((market) => (
                <SelectItem key={market._id} value={market._id} >
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
      </div>
    </div>
  );
}
