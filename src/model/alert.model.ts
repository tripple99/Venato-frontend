export interface PriceTrendBucket {
  _id: string; // Date string: YYYY-MM-DD
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  count: number;
}
import type { Product } from "./product.model";
import type { IMarketData } from "./market.model";

export interface Alert {
  id: string;
  productId: string | Product;
  marketId: string | IMarketData;
  targetValue: number;
  condition: "equal" | "above" | "below" | "change_pct";
  currency: string;
  cooldownMinutes?: number;
  lastTriggeredAt?: string;
  isActive: boolean;
}
export interface ThresholdSuggestions {
  supportPrice: number;
  resistancePrice: number;
  averagePrice: number;
  volatilityHigh: number;
  volatilityLow: number;
  unusualMovementThreshold: number;
}