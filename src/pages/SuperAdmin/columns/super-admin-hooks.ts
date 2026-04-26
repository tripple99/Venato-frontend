import { useState, useCallback } from "react";
import accessControlService from "@/service/access-control.service";
import accessService from "@/service/access.service";
import { toast } from "sonner";
import type { IProfile } from "@/model/user.model";
import { AuthRole} from "@/model/auth.model";
import marketService from "@/service/market.service";
import type { IMarketData } from "@/model/market.model";
export const useAccessControlHook = () => {
  const [users, setUsers] = useState<IProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [markets, setMarkets] = useState<IMarketData[]>([]);
  const [marketPagination, setMarketPagination] = useState({
    page: 1, limit: 10, hasNextPage: false, isLoading: false,
  });

  const fetchUsers = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    try {
      const response = await accessControlService.getAccessControl(page, limit);
      if (response?.payload && Array.isArray(response.payload.data)) {
        setUsers(response.payload.data);
        setPagination({
          page: response.payload.currentPage,
          limit: response.payload.limit,
          totalCount: response.payload.totalCount,
          totalPages: response.payload.totalPages,
          hasNextPage: response.payload.hasNextPage,
          hasPreviousPage: response.payload.hasPreviousPage,
        });
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllMarkets = useCallback(async (page = 1) => {
     try {
      setMarketPagination(p => ({ ...p, isLoading: true }));
      const response = await marketService.getAllMarkets({ page, limit: 10 });
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
    if (marketPagination.hasNextPage && !marketPagination.isLoading) {
      fetchAllMarkets(marketPagination.page + 1);
    }
  }, [marketPagination, fetchAllMarkets]);


  const grantRoleAccess = async (uid: string, grantRole: AuthRole) => {
    try {
      setIsLoading(true);
      await accessService.grantUserRole(uid, grantRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === uid ? { ...u, roles: grantRole, userRole: grantRole } : u))
      );
      toast.success(`Role updated to ${grantRole}`);
      return { success: true };
    } catch (error) {
      console.error("Failed to grant role:", error);
      toast.error(`Failed to update role. Please try again.`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const grantMarketAccess = async (uid: string, grantMarket: string) => {
    try {
      setIsLoading(true);
      await accessService.grantMarketAccess(uid, grantMarket);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === uid
            ? { ...u, allowedMarkets: Array.isArray(u.allowedMarkets) ? Array.from(new Set([...u.allowedMarkets, grantMarket])) : [grantMarket] }
            : u
        )
      );
      toast.success(`Market access granted: ${grantMarket}`);
      return { success: true };
    } catch (error) {
      console.error("Failed to grant market access:", error);
      toast.error(`Failed to grant market access. Please try again.`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const revokeAccess = async (uid: string) => {
    try {
      setIsLoading(true);
      await accessService.revokeUserAccess(uid);
      
      setUsers((prev) =>
        prev.map((u) =>
          u._id === uid
            ? { ...u, userRole: "user", allowedMarkets: [] }
            : u
        )
      );
      toast.success("User access revoked");
      return { success: true };
    } catch (error) {
      console.error("Failed to revoke access:", error);
      toast.error(`Failed to revoke access. Please try again.`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const inviteAdminUser = async (email: string, fullname: string, role: AuthRole) => {
    try {
      setIsLoading(true);
      await accessControlService.inviteAdminUser(email, fullname, role);
      toast.success("Admin user successfully invited. An email has been sent.");
      fetchUsers(pagination.page, pagination.limit);
      return { success: true };
    } catch (error) {
      console.error("Failed to invite admin user:", error);
      toast.error("Failed to invite user. Please try again.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    pagination,
    setPagination,
    fetchUsers,
    markets,
    marketPagination,
    fetchAllMarkets,
    loadMoreMarkets,
    grantRoleAccess,
    grantMarketAccess,
    revokeAccess,
    inviteAdminUser,
  };
};
