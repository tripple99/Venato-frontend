import marketService from "@/service/market.service";
import productService from "@/service/product.service";
import { type IMarketData } from "@/model/market.model";
import type { Product } from "@/model/product.model";
import { useState, useCallback } from "react";
import { type IPaginationMetadata } from "@/model/pagination.model";
import watchListService from "@/service/watch-list.service";
import type{WatchList} from "@/model/watch-list.model";
export const useMarketHook = () => {
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
    const [markets, setMarkets] = useState<IMarketData[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [market, setMarket] = useState<IMarketData | null>(null);
    const [_watchList, setWatchList] = useState<WatchList[]>([]);
    
    const [marketPagination, setMarketPagination] = useState<IPaginationMetadata>({
        currentPage: 1, limit: 10, totalPages: 0, totalCount: 0, hasNextPage: false, hasPreviousPage: false
    });
    
    const [productPagination, setProductPagination] = useState<IPaginationMetadata>({
        currentPage: 1, limit: 10, totalPages: 0, totalCount: 0, hasNextPage: false, hasPreviousPage: false
    });

    const addToWatchList = async (productId: string) => {
        try {
            const response = await watchListService.addToWatchList(productId);
            if (response?.payload) {
                setWatchList(prev => [...prev, response.payload]);
                setProducts(prev => prev.map(p => p._id === productId ? { ...p, isWatched: true } : p));
            }
           
        } catch (error) {
            console.error("Error adding to watch list:", error);
        }
    };
    const fetchMarkets = useCallback(async (page = 1, limit = 10, search?: string) => {
        try {
            setIsLoadingMarkets(true);
            const params: any = { page, limit };
            if (search) params.search = search;
            
            const response = await marketService.getPublicMarkets(params);
            if (response?.payload && Array.isArray(response.payload.data)) {
                if (page === 1) {
                    setMarkets(response.payload.data);
                } else {
                    setMarkets(prev => [...prev, ...response.payload.data]);
                }
                setMarketPagination({
                    currentPage: response.payload.currentPage,
                    limit: response.payload.limit,
                    totalPages: response.payload.totalPages,
                    totalCount: response.payload.totalCount,
                    hasNextPage: response.payload.hasNextPage,
                    hasPreviousPage: response.payload.hasPreviousPage,
                });
            }
        } catch (error) {
            console.error("Error fetching markets:", error);
        } finally {
            setIsLoadingMarkets(false);
        }
    }, []);

    const fetchMarketsById = useCallback(async (id: string) => {
        try {
            setIsLoadingMarkets(true);
            const response = await marketService.getMarketById(id);
            if (response?.payload) {
                setMarket(response.payload);
            }
        } catch (error) {
            console.error("Error fetching markets:", error);
        } finally {
            setIsLoadingMarkets(false);
        }
    }, []);

    const fetchProducts = useCallback(async (page = 1, limit = 10, filters?: { search?: string, marketId?: string, category?: string }) => {
        try {
            setIsLoadingProducts(true);
 
            const params: any = { page, limit, ...filters };
            
            const response = await productService.getAllProducts(params);
            if (response?.payload && Array.isArray(response.payload.data)) {
                if (page === 1) {
                    setProducts(response.payload.data);
                } else {
                    setProducts(prev => [...prev, ...response.payload.data]);
                }
                setProductPagination({
                    currentPage: response.payload.currentPage,
                    limit: response.payload.limit,
                    totalPages: response.payload.totalPages,
                    totalCount: response.payload.totalCount,
                    hasNextPage: response.payload.hasNextPage,
                    hasPreviousPage: response.payload.hasPreviousPage,
                });
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    const loadMoreProducts = useCallback((filters?: { search?: string, marketId?: string, category?: string }) => {
        if (productPagination.hasNextPage && !isLoadingProducts) {
            fetchProducts(productPagination.currentPage + 1, productPagination.limit, filters);
        }
    }, [productPagination, isLoadingProducts, fetchProducts]);

    return {
        isLoadingProducts,
        isLoadingMarkets,
        markets,
        products,
        marketPagination,
        productPagination,
        addToWatchList,
        fetchMarkets,
        fetchProducts,
        loadMoreProducts,
        market,
        fetchMarketsById
    };
};