import type { Product } from "./product.model";
import type { IMarketData } from "./market.model";

export interface InventoryItem {
  _id: string;
  productId: string | Product;
  userId: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  quantity: number;
  unit: string;
  preferredMarket: string | IMarketData;
}
