import type { Product, Market } from "./product.model";



export interface StatsResult {
  // --- Super Admin Specific ---
  usersCount?: number;
  activeUsers?: number;
  marketsCount?: number;
  totalSnapshots?: number;      
  recentPriceChanges?: number;  
  activeMarkets?: number;
  recentMarkets?: Market[];

  // --- Admin Specific ---
  productsCount?: number;       
  assignedMarkets?: number;     
  totalProductsListed?: number; 
  marketActivity?: number;      
  recentProducts?: Product[];    

  // --- User Specific ---
  totalInventoryValue?: number;  
  inventoryItems?: number;      
  inventoryValueChange?: number; 
  inventoryStatus?: 'increased' | 'decreased' | 'stable';
  watchlistCount?: number;      
  activeAlerts?: number;        

  // --- General/Legacy ---
  totalMarkets?: number;
}