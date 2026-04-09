import type { PaginatedResponse } from "./api";

export interface PortfolioHolding {

    productName: string;
    quantity: number;
    unit: string;
    currentPrice: number;
    previousPrice: number;
    currentValue: number;
    percentageChange: number;
    status: "increased" | "decreased";
    otherMarketMaxPrice?: number;
    otherMarketAvgPrice?: number;

 
}
export interface PortfolioResponse {

    totalPortfolioValue: number;
    holdings: PaginatedResponse<PortfolioHolding>;

}