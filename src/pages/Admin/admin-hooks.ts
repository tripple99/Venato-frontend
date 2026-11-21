import productService from "@/service/product.service";
import { useState, useEffect, useCallback } from "react";
import marketService from "@/service/market.service";
import { type IMarketData } from "@/model/market.model";
import type { Product } from "@/model/product.model";
import type { IPaginationMetadata } from "@/model/pagination.model";
import type {
  IMarketProduct,
  IUnit,
  ICategory,
  MarketNames,
} from "@/types/market.types";
import { type Products } from "@/types/products";
import {type ILocation } from "@/model/market.model";
import { useAuthStore } from "@/store/authStore";
import userService from "@/service/user.service";


export const useProductHook = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [markets, setMarkets] = useState<IMarketData[]>([]);
  const [pagination, setPagination] = useState<IPaginationMetadata>({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const mapToProducts = useCallback((p: Product, fallbackMarkets: IMarketData[] = []): Products => {
    const rawMarket = p.market as Product["market"] | string | undefined;
    const marketObj =
      typeof rawMarket === "string"
        ? fallbackMarkets.find((m) => m._id === rawMarket)
        : rawMarket;

    const location: ILocation = {
      state: marketObj?.location?.state || "",
      code: marketObj?.location?.code || "",
      LGA: marketObj?.location?.LGA || "",
      coordinates: marketObj?.location?.coordinates,
      country: marketObj?.location?.country || "Nigeria",
    };

    return {
      _id: p._id,
      name: p.name,
      price: p.price,
      unit: p.unit as IUnit,
      category: p.category as ICategory,
      location: location,
      quantityAvailable: p.quantityAvailable,
      market: {
        _id: marketObj?._id || (typeof rawMarket === "string" ? rawMarket : ""),
        name: (marketObj?.name || "") as MarketNames,
        location: location,
      },
      images: p.images || [],
      created_at: new Date(),
      update_at: new Date(),
    };
  }, []);


  const createProduct = async (product: IMarketProduct) => {
    try {
      setIsMutating(true);
      const res = await productService.createProduct(product);
      const data = res?.payload;

      if (data) {
        setProducts((prev) => [mapToProducts(data, markets), ...prev]);
        setPagination((prev) => ({
          ...prev,
          totalCount: prev.totalCount + 1,
        }));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false };
    } finally {
      setIsMutating(false);
    }
  };

  const updateProducts = async (id: string, product: IMarketProduct) => {
    try {
      setIsMutating(true);
      const res = await productService.updateProduct(id, product);
      if (res?.payload) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? mapToProducts(res.payload, markets) : p)),
        );
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false };
    } finally {
      setIsMutating(false);
    }
  };

  const deleteProduct = async (id: string, marketId: string) => {
    try {
      setIsMutating(true);
      const res = await productService.deleteProduct(id, marketId);
      if (res) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setPagination((prev) => ({
          ...prev,
          totalCount: Math.max(0, prev.totalCount - 1),
        }));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false };
    } finally {
      setIsMutating(false);
    }
  };
  const getProducts = useCallback(
    async (page?: number, limit?: number, search?: string) => {
      try {
        setIsLoading(true);
        const res = await productService.getProducts({ page, limit, search });
       
       
        setIsLoading(false);
        if (res?.payload) {
          setProducts(res.payload.data.map((p) => mapToProducts(p)));
          setPagination({
            currentPage: res.payload.currentPage,
            limit: res.payload.limit,
            totalCount: res.payload.totalCount,
            totalPages: res.payload.totalPages,
            hasNextPage: res.payload.hasNextPage,
            hasPreviousPage: res.payload.hasPreviousPage,
          });
        }
         const marketId = useAuthStore.getState().user?.userMarket;
         if(!marketId){
            const profile = await userService.getMyProfile()
       
        if (profile?.payload) {
          
          useAuthStore.setState({
            user: profile.payload,
          });
        }
         }
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    },
    [mapToProducts],
  );

  const fetchUserMarkets = useCallback(async (ids: string | string[]) => {
    try {
      const idArray = Array.isArray(ids) ? ids : [ids];
      const marketPromises = idArray.map(id => marketService.getMarketById(id));
      const responses = await Promise.all(marketPromises);
      const validMarkets = responses
        .filter(res => res?.payload)
        .map(res => res!.payload);
      setMarkets(validMarkets);
    } catch (error) {
      console.error("Error fetching user markets:", error);
    }
  }, []);

  useEffect(() => {
    getProducts(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage, pagination.limit, getProducts]);

  return {
    products,
    isLoading,
    isMutating,
    markets,
    pagination,
    getProducts,
    createProduct,
    updateProducts,
    deleteProduct,
    fetchUserMarkets
  };
};
