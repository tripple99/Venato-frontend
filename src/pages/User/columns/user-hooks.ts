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

    const createInventory = async (payload: any) => {
        try {
            setIsLoading(true);
            const response = await inventoryService.addInventoryItem(payload);
            if (response?.payload) {
                setInventory((prev) => [...prev, response.payload]);
                toast.success("Item added to inventory");
                return { success: true, data: response.payload };
            }
            return { success: false };
        } catch (error) {
            console.error("Failed to create inventory:", error);
            toast.error("Failed to add item to inventory");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const updateInventory = async (id: string, payload: any) => {
        try {
            setIsLoading(true);
            const response = await inventoryService.updateInventoryItem(id, payload);
            if (response?.payload) {
                setInventory((prev) =>
                    prev.map((item) => (item._id === id ? response.payload : item))
                );
                toast.success("Inventory updated successfully");
                return { success: true, data: response.payload };
            }
            return { success: false };
        } catch (error) {
            console.error("Failed to update inventory:", error);
            toast.error("Failed to update inventory");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteInventory = async (id: string) => {
        try {
            setIsLoading(true);
            await inventoryService.removeInventoryItem(id);
            setInventory((prev) => prev.filter((item) => item._id !== id));
            toast.success("Item removed from inventory");
            return { success: true };
        } catch (error) {
            console.error("Failed to delete inventory:", error);
            toast.error("Failed to remove item from inventory");
            return { success: false };
        } finally {
            setIsLoading(false);
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
        setIsLoading(true);
        const response = await alertService.createAlert(payload);
        if (response?.payload) {
            setAlert((prev) => [...prev, response.payload]);
            toast.success("Alert created successfully");
            return { success: true, data: response.payload };
        }
        return { success: false };
    } catch (error) {
        console.error("Failed to create alert:", error);
        toast.error("Failed to create alert");
        return { success: false };
    } finally {
        setIsLoading(false);
    }
   };

   const updateAlert = async (id: string, payload: any) => {
    try {
        setIsLoading(true);
        const response = await alertService.updateAlert(id, payload);
        if (response?.payload) {
            setAlert((prev) => prev.map((item) => (item._id === id ? response.payload : item)));
            toast.success("Alert updated successfully");
            return { success: true, data: response.payload };
        }
        return { success: false };
    } catch (error) {
        console.error("Failed to update alert:", error);
        toast.error("Failed to update alert");
        return { success: false };
    } finally {
        setIsLoading(false);
    }
   };

   const deleteAlert = async (id: string) => {
    try {
        setIsLoading(true);
        await alertService.deleteAlert(id);
        setAlert((prev) => prev.filter((item) => item._id !== id));
        toast.success("Alert deleted successfully");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete alert:", error);
        toast.error("Failed to delete alert");
        return { success: false };
    } finally {
        setIsLoading(false);
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