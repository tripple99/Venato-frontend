import { useState, useCallback } from "react";
import { toast } from "sonner";
import marketService from "@/service/market.service";
import type { IMarketData } from "@/model/market.model";
import productService from "@/service/product.service";
import type { Product } from "@/model/product.model";
import type { InventoryItem } from "@/model/inventory.model";
import inventoryService from "@/service/inventory.service";
import type { Alert } from "@/model/alert.model";
import alertService from "@/service/alert.service";
import {type IPaginationMetadata } from "@/model/pagination.model";
export const useUserHook = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [inventoryPagination, setInventoryPagination] = useState<IPaginationMetadata>({
        currentPage: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
    });
    const [alert,setAlert] = useState<Alert[]>([]);
    const [alertPagination, setAlertPagination] = useState({
        
        currentPage: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 1,
        hasPreviousPage: false,

        hasNextPage: false,
    });
    const [productPagination, setProductPagination] = useState<IPaginationMetadata>({
        currentPage: 1,
        limit: 10, 
        hasNextPage: false, 
        totalCount:0,
        totalPages:1,
        hasPreviousPage:false,
    });
    const [markets, setMarkets] = useState<IMarketData[]>([]);
    const [marketPagination, setMarketPagination] = useState<IPaginationMetadata>({
        currentPage: 1,
        limit: 10, 
        hasNextPage: false, 
        totalCount:0,
        totalPages:1,
        hasPreviousPage:false,
    });

    const enrichInventoryItem = (item: InventoryItem): InventoryItem => {
        const enrichedProduct =
            typeof item.productId === "string"
                ? products.find((p) => p._id === item.productId) || item.productId
                : item.productId;
        const enrichedMarket =
            typeof item.preferredMarket === "string"
                ? markets.find((m) => m._id === item.preferredMarket) || item.preferredMarket
                : item.preferredMarket;

        return {
            ...item,
            productId: enrichedProduct as InventoryItem["productId"],
            preferredMarket: enrichedMarket as InventoryItem["preferredMarket"],
        };
    };

    const enrichAlertItem = (item: Alert): Alert => {
        const enrichedProduct =
            typeof item.productId === "string"
                ? products.find((p) => p._id === item.productId) || item.productId
                : item.productId;
        const marketId =
            typeof item.market === "string"
                ? item.market
                : (item as any).marketId;
        const enrichedMarket =
            typeof item.market === "object" && item.market
                ? item.market
                : markets.find((m) => m._id === marketId) || item.market;

        return {
            ...item,
            productId: enrichedProduct as Alert["productId"],
            market: enrichedMarket as Alert["market"],
        };
    };

    const createInventory = async (payload: any) => {
        try {
            setIsMutating(true);
            const response = await inventoryService.addInventoryItem(payload);
            if (response?.payload) {
                const enriched = enrichInventoryItem(response.payload);
                setInventory((prev) => [enriched, ...prev]);
                setInventoryPagination((prev) => ({
                    ...prev,
                    totalCount: prev.totalCount + 1,
                }));
                return { success: true, data: enriched };
            }
            return { success: false };
        } catch (error) {
            console.error("Failed to create inventory:", error);
            toast.error("Failed to add item to inventory");
            return { success: false };
        } finally {
            setIsMutating(false);
        }
    };

    const updateInventory = async (id: string, payload: any) => {
        try {
            setIsMutating(true);
            const response = await inventoryService.updateInventoryItem(id, payload);
            if (response?.payload) {
                const enriched = enrichInventoryItem(response.payload);
                setInventory((prev) =>
                    prev.map((item) => (item._id === id ? enriched : item))
                );
                return { success: true, data: enriched };
            }
            return { success: false };
        } catch (error) {
            console.error("Failed to update inventory:", error);
            toast.error("Failed to update inventory");
            return { success: false };
        } finally {
            setIsMutating(false);
        }
    };

    const deleteInventory = async (id: string) => {
        try {
            setIsMutating(true);
            const response = await inventoryService.removeInventoryItem(id);
            if (response) {
                setInventory((prev) => prev.filter((item) => item._id !== id));
                setInventoryPagination((prev) => ({
                    ...prev,
                    totalCount: Math.max(0, prev.totalCount - 1),
                }));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error("Failed to delete inventory:", error);
            toast.error("Failed to remove item from inventory");
            return { success: false };
        } finally {
            setIsMutating(false);
        }
    };

    const fetchInventory = useCallback(async (page = 1, limit = 10) => {
        try {
            setIsLoading(true);
            const params = { page, limit };
            const response = await inventoryService.getInventory(params);
            if (response?.payload && Array.isArray(response.payload.data)) {
                setInventory(response.payload.data);
                setInventoryPagination({
                    currentPage: response.payload.currentPage,
                    limit: response.payload.limit,
                    totalCount: response.payload.totalCount,
                    totalPages: response.payload.totalPages,
                    hasNextPage: response.payload.hasNextPage,
                    hasPreviousPage: response.payload.hasPreviousPage,
                });
            }
            return response;
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    

   const createAlert = async (payload: any) => {
    try {
        setIsMutating(true);
        const response = await alertService.createAlert(payload);
        if (response?.payload) {
            const enriched = enrichAlertItem({
                ...response.payload,
                market: response.payload.market || payload.marketId,
            });
            setAlert((prev) => [enriched, ...prev]);
            setAlertPagination((prev) => ({
                ...prev,
                totalCount: prev.totalCount + 1,
            }));
            return { success: true, data: enriched };
        }
        return { success: false };
    } catch (error) {
        console.error("Failed to create alert:", error);
        toast.error("Failed to create alert");
        return { success: false };
    } finally {
        setIsMutating(false);
    }
   };

   const updateAlert = async (id: string, payload: any) => {
    try {
        setIsMutating(true);
        const response = await alertService.updateAlert(id, payload);
        if (response?.payload) {
            const enriched = enrichAlertItem(response.payload);
            setAlert((prev) => prev.map((item) => ((item._id || item.id) === id ? enriched : item)));
            return { success: true, data: enriched };
        }
        return { success: false };
    } catch (error) {
        console.error("Failed to update alert:", error);
        toast.error("Failed to update alert");
        return { success: false };
    } finally {
        setIsMutating(false);
    }
   };

   const deleteAlert = async (id: string) => {
    try {
        setIsMutating(true);
        const response = await alertService.deleteAlert(id);
        if (response) {
            setAlert((prev) => prev.filter((item) => (item._id || item.id) !== id));
            setAlertPagination((prev) => ({
                ...prev,
                totalCount: Math.max(0, prev.totalCount - 1),
            }));
            return { success: true };
        }
        return { success: false };
    } catch (error) {
        console.error("Failed to delete alert:", error);
        toast.error("Failed to delete alert");
        return { success: false };
    } finally {
        setIsMutating(false);
    }
   };
   const fetchAlerts = useCallback(async (page = 1, limit = 10) => {
    try {
        setIsLoading(true);
        const params = { page, limit };
        const response = await alertService.getAlerts(params);
        if (response?.payload && Array.isArray(response.payload.data)) {
            setAlert(response.payload.data);
            setAlertPagination({
                currentPage: response.payload.currentPage,
                limit: response.payload.limit,
                totalCount: response.payload.totalCount,
                totalPages: response.payload.totalPages,
                hasNextPage: response.payload.hasNextPage,
                hasPreviousPage: response.payload.hasPreviousPage,
            });
        }
        return response;
    } catch (error) {
        console.error("Failed to fetch alerts:", error);
    } finally {
        setIsLoading(false);
    }
   }, []);



    const fetchAllProducts = useCallback(async (page = 1, marketId?: string) => {
        try {
            setProductPagination(p => ({ ...p, isLoading: true }));
            const params: any = {
                page,
                limit: 10,

            };
            if (marketId) params.marketId = marketId;

            const response = await productService.getAllProducts(params);
            if (response?.payload && Array.isArray(response.payload.data)) {
                if (page === 1) {
                    setProducts(response.payload.data);
                } else {
                    setProducts(prev => [...(prev || []), ...response.payload.data]);
                }
                setProductPagination(p => ({
                    ...p,
                    page: response.payload.currentPage,
                    hasNextPage: response.payload.hasNextPage,
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProductPagination(p => ({ ...p, isLoading: false }));
        }
    }, []);

    const loadMoreProducts = useCallback((marketId?: string) => {
        if (productPagination.hasNextPage) {
            fetchAllProducts(productPagination.currentPage + 1, marketId);
        }
    }, [productPagination, fetchAllProducts]);

    const fetchAllMarkets = useCallback(async (page = 1) => {
        try {
            setMarketPagination(p => ({ ...p, isLoading: true }));
            const response = await marketService.getPublicMarkets({ page, limit: 10 });
            if (response?.payload && Array.isArray(response.payload.data)) {
                if (page === 1) {
                    setMarkets(response.payload.data);
                } else {
                    setMarkets(prev => [...(prev || []), ...response.payload.data]);
                }
                setMarketPagination(p => ({
                    ...p,
                    page: response.payload.currentPage,
                    hasNextPage: response.payload.hasNextPage,
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error("Failed to fetch markets:", error);
            setMarketPagination(p => ({ ...p, isLoading: false }));
        }
    }, []);

    const loadMoreMarkets = useCallback(() => {
        if (marketPagination.hasNextPage) {
            fetchAllMarkets(marketPagination.currentPage + 1);
        }
    }, [marketPagination, fetchAllMarkets]);

    return {
        isLoading,
        isMutating,
        markets,
        marketPagination,
        fetchAllMarkets,
        products,
        productPagination,
        fetchAllProducts,
        loadMoreProducts,
        loadMoreMarkets,
        createInventory,
        updateInventory,
        deleteInventory,
        fetchInventory,
        inventory,
        inventoryPagination,
        setInventoryPagination,
        alert,
        alertPagination,
        fetchAlerts,
        createAlert,
        updateAlert,
        deleteAlert,
    };
};