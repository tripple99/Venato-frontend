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
  const [markets, setMarkets] = useState<IMarketData[]>([]);
  const [pagination, setPagination] = useState<IPaginationMetadata>({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const mapToProducts = (p: Product): Products => {
    const location: ILocation = {
      ...p?.market?.location,
      country: p?.market?.location?.country || "Nigeria"
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
        _id: p.market._id,
        name: p.market.name as MarketNames,
        location: location,
      },
      images: p.images || [],
      created_at: new Date(),
      update_at: new Date(),
    };
  };


  const createProduct = async (product: IMarketProduct) => {
    try {
      setIsLoading(true);
      console.log(product);
      const res = await productService.createProduct(product);
      setIsLoading(false);
     
      const data = res?.payload;
    
      if (data) {
        setProducts((prev) => [mapToProducts(data), ...prev]);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating product:", error);
      return { success: false };
    }
  };

  const updateProducts = async (id: string, product: IMarketProduct) => {
    try {
      setIsLoading(true);
      const res = await productService.updateProduct(id, product);
      setIsLoading(false);
      if (res?.payload) {
        setProducts((prev) => prev.map((p) => p._id === id ? mapToProducts(res.payload) : p));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating product:", error);
      return { success: false };
    }
  };
  const deleteProduct = async (id: string, marketId: string) => {
    try {
      setIsLoading(true);
      const res = await productService.deleteProduct(id, marketId);
      setIsLoading(false);
      if (res?.payload) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting product:", error);
      return { success: false };
    }
  };
  const getProducts = useCallback(
    async (page?: number, limit?: number, search?: string) => {
      try {
        setIsLoading(true);
        const res = await productService.getProducts({ page, limit, search });
       
       
        setIsLoading(false);
        if (res?.payload) {
          setProducts(res.payload.data.map(mapToProducts));
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
         console.log(marketId);
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
    [],
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
    markets,
    pagination,
    getProducts,
    createProduct,
    updateProducts,
    deleteProduct,
    fetchUserMarkets
  };
};
