import type { ApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import type { PortfolioResponse } from "@/model/portfolio.model";

class PortfolioService {
  private baseUrl: string = "/inventory";

  /**
   * Fetches the user's portfolio with holdings and total value.
   */
  public async getPortfolio(page:number,limit:number): Promise<ApiResponse<PortfolioResponse> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<PortfolioResponse>>(`${this.baseUrl}/portfolio?page=${page}&limit=${limit}`);

      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const portfolioService = new PortfolioService();
export default portfolioService;
