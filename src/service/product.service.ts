import type { ApiResponse, PaginatedApiResponse } from "@/model/api";
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
  public async createProduct(
    payload: IMarketProduct,
  ): Promise<ApiResponse<Product>> {
    try {
      let requestData: any = payload;

      // Check if we have files to upload

        const formData = new FormData();
        
        // Add flat fields explicitly to avoid [object Object] issues
        formData.append("name", payload.name);
        formData.append("price", 
          String(payload.price));
        formData.append("unit", payload.unit);
        formData.append("category", payload.category);
        formData.append("marketId", payload.marketId);
        
        if (payload.quantityAvailable) formData.append("quantityAvailable", String(payload.quantityAvailable));
        if (payload.description) formData.append("description", payload.description);

        // Add the image files
        if (payload.image && payload.image.length > 0) 
        payload.image.forEach((file) => formData.append("image", file));
        
        requestData = formData;
   

      const response = await apiClient.post<ApiResponse<Product>>(
        this.baseUrl,
        requestData,
      );
      toast.success(response.data.message || "Product created successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
      throw error;
    }
  }

  /**
   * Fetches every product in the system.
   */
  public async getAllProducts(params?: any): Promise<PaginatedApiResponse<Product>> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<Product>>(
        `${this.baseUrl}/all`,
        { params },
      );
      return response.data;
    } catch (error) {
      handleAnyError(error);
      throw error;
    }
  }

  /**
   * Fetches products filtered by the user's assigned markets.
   * @param params Optional query parameters for filtering (e.g. category)
   */
  public async getProducts(
    params?: any,
  ): Promise<PaginatedApiResponse<Product> | undefined> {
    try {
      const response = await apiClient.get<PaginatedApiResponse<Product>>(
        this.baseUrl,
        { params },
      );
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Fetches a single product's details by its ID.
   * @param id Product ID
   */
  public async getProductById(
    id: string,
  ): Promise<ApiResponse<Product> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `${this.baseUrl}/${id}`,
      );
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
  public async filterByPrice(
    price: number,
    params?: any,
  ): Promise<ApiResponse<Product[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `${this.baseUrl}/price/${price}`,
        { params },
      );
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
  public async filterByMarket(
    market: string,
    params?: any,
  ): Promise<ApiResponse<Product[]> | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `${this.baseUrl}/market/${market}`,
        { params },
      );
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
  public async updateProduct(
    id: string,
    payload: Partial<IMarketProduct>,
  ): Promise<ApiResponse<Product> | undefined> {
    try {
      let requestData: any = payload;

      // Check if we have files to upload
   
        const formData = new FormData();
        
        if (payload.name) formData.append("name", payload.name);
        if (payload.price) formData.append("price", String(payload.price));
        if (payload.unit) formData.append("unit", payload.unit);
        if (payload.category) formData.append("category", payload.category);
        if (payload.marketId) formData.append("marketId", payload.marketId);
        if (payload.quantityAvailable) formData.append("quantityAvailable", String(payload.quantityAvailable));
        if (payload.description) formData.append("description", payload.description);

        // Add existing image URLs (if any) to preserve them
        if ((payload as any).images && Array.isArray((payload as any).images)) {
          (payload as any).images.forEach((url: string) => formData.append("images", url));
        }

        // Add the image files
        if (payload.image && payload.image.length > 0) 
        payload.image.forEach((file) => formData.append("image", file));
        
        requestData = formData;


      const response = await apiClient.patch<ApiResponse<Product>>(
        `${this.baseUrl}/${id}`,
        requestData,
      )
      toast.success(response.data.message || "Product updated successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }

  /**
   * Removes a product from the database.
   * @param id Product ID
   * @param marketId Market ID
   */
  public async deleteProduct(
    id: string,
    marketId: string,
  ): Promise<ApiResponse<any> | undefined> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(
        `${this.baseUrl}/${id}/${marketId}`,
      );
      toast.success(response.data.message || "Product deleted successfully");
      return response.data;
    } catch (error) {
      handleAnyError(error);
    }
  }
}

const productService = new ProductService();
export default productService;
