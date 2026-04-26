import { useState, useCallback, useEffect } from "react";
import notificationService from "@/service/notification.service";
import type { INotification, NotificationStatus } from "@/model/notification.model";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export function useNotifications() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
  });

  const { user } = useAuthStore();

  const fetchNotifications = useCallback(async (page = 1, limit = 10, refresh = false) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await notificationService.getUserNotifications(page, limit);
      if (response?.payload && Array.isArray(response.payload.data)) {
        if (refresh || page === 1) {
          setNotifications(response.payload.data);
        } else {
          setNotifications((prev) => {
            const newItems = response.payload.data.filter(
              (item) => !prev.some((p) => p._id === item._id)
            );
            return [...prev, ...newItems];
          });
        }
        setPagination({
          page: response.payload.currentPage,
          limit: response.payload.limit,
          totalCount: response.payload.totalCount,
          totalPages: response.payload.totalPages,
          hasNextPage: response.payload.hasNextPage,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "READ" as NotificationStatus } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "READ" as NotificationStatus }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Setup polling every minute for unread count
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
