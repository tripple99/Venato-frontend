import { useState } from "react";
import { Bell, Check, CheckCircle2, Info, Tag, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationType, NotificationStatus } from "@/model/notification.model";
import type { INotification } from "@/model/notification.model";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

export default function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications, isLoading } = useNotifications();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM:
        return <Info className="h-4 w-4 text-blue-500" />;
      case NotificationType.ALERT:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case NotificationType.PROMO:
        return <Tag className="h-4 w-4 text-green-500" />;
      case NotificationType.MARKET:
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      case NotificationType.PRICE_CHANGE:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = (notification: INotification) => {
    if (notification.status === NotificationStatus.UNREAD) {
      markAsRead(notification._id);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-2xl relative focus:outline-none cursor-pointer">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-sm border border-background">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-[340px] sm:w-[380px] p-0 border-border rounded-lg shadow-lg" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <DropdownMenuLabel className="p-0 font-semibold text-base">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              className="h-8 text-xs text-muted-foreground hover:text-primary px-2 cursor-pointer"
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[350px] sm:h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <Spinner className="h-8 w-8 text-primary-venato" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center text-muted-foreground">
              <Bell className="h-10 w-10 mb-4 opacity-20" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs mt-1">We'll let you know when something arrives.</p>
            </div>
          ) : (
            <div className="flex flex-col py-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className={cn(
                    "flex items-start gap-3 p-4 cursor-pointer focus:bg-muted/50 rounded-none border-b border-border/50 last:border-0",
                    notification.status === NotificationStatus.UNREAD ? "bg-primary/5" : ""
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mt-0.5 bg-background p-1.5 rounded-full border shadow-sm shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium leading-none truncate",
                          notification.status === NotificationStatus.UNREAD
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {notification.status === NotificationStatus.UNREAD && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
