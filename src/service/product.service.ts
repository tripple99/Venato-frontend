import type { ApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import { toast } from "sonner";
import type { IMarketProduct } from "@/types/market.types";
import type { Product } from "@/model/product.model";

class ProductService {
  private baseUrl: string = "/product";

  /**
   * Creates a new product in a specific market.
   * @param payload Product data including marketId
   */
  public async createProduct(payload: IMarketProduct): Promise<ApiResponse<Product> | undefined> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(this.baseUrl, payload);
      toast.success(response.data.message || "Product created successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Fetches every product in the system.
   */
  public async getAllProducts(): Promise<ApiResponse<Product[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(`${this.baseUrl}/all`);
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Fetches products filtered by the user's assigned markets.
   * @param params Optional query parameters for filtering (e.g. category)
   */
  public async getProducts(params?: any): Promise<ApiResponse<Product[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Fetches a single product's details by its ID.
   * @param id Product ID
   */
  public async getProductById(id: string): Promise<ApiResponse<Product> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Filters products by price with optional extra filtering.
   * @param price Price threshold
   * @param params Optional query strings (e.g. ?category=Grains)
   */
  public async filterByPrice(price: number, params?: any): Promise<ApiResponse<Product[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(`${this.baseUrl}/price/${price}`, { params });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Fetches products for a specific market location or ID.
   * @param market Market name or ID
   * @param params Optional query strings
   */
  public async filterByMarket(market: string, params?: any): Promise<ApiResponse<Product[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(`${this.baseUrl}/market/${market}`, { params });
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Partially updates an existing product.
   * @param id Product ID
   * @param payload Partial product data
   */
  public async updateProduct(id: string, payload: Partial<IMarketProduct>): Promise<ApiResponse<Product> | undefined> {
    try {
      const response = await apiClient.patch<ApiResponse<Product>>(`${this.baseUrl}/${id}`, payload);
      toast.success(response.data.message || "Product updated successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Removes a product from the database.
   * @param id Product ID
   */
  public async deleteProduct(id: string): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
      toast.success(response.data.message || "Product deleted successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const productService = new ProductService();
export default productService;
