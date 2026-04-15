import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Bell,
  ClipboardList,
  Package,
  ShieldCheck,
  AlertTriangle,
  Store,
  LayoutDashboardIcon,
  LogOut,
  LayoutList,
  Menu,
  PanelLeft,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { AuthRole } from "@/model/auth.model";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { authAPI } from "@/api/api-client";
import { toast } from "sonner";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  url: string;
}

const ROLE_CONFIG: Record<AuthRole, SidebarItem[]> = {
  [AuthRole.User]: [
    {
      title: "Dashboard",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
      url: "/user",
    },
    {
      title: "Inventory",
      icon: <Package className="w-5 h-5" />,
      url: "/user/inventory",
    },
    {
      title: "Watch list",
      icon: <LayoutList className="w-5 h-5" />,
      url: "/user/watchlist",
    },
    {
      title: "Alerts",
      icon: <AlertTriangle className="w-5 h-5" />,
      url: "/user/alerts",
    },
  ],
  [AuthRole.Admin]: [
    {
      title: "Dashboard",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
      url: "/admin",
    },
    {
      title: "Products Management",
      icon: <ClipboardList className="w-5 h-5" />,
      url: "/admin/products",
    },
  ],
  [AuthRole.superAdmin]: [
    {
      title: "Dashboard",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
      url: "/superadmin",
    },
    {
      title: "Market Management",
      icon: <Store className="w-5 h-5" />,
      url: "/superadmin/market",
    },
    {
      title: "Access Control",
      icon: <ShieldCheck className="w-5 h-5" />,
      url: "/superadmin/access",
    },
  ],
};

export default function AdminLayout() {
  const [notifications] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logOutModal, setLogOutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const role = user?.roles;
  console.log("....user.....",role)
  const sidebarItems = useMemo(() => {
    if (!role) return [];
    return ROLE_CONFIG[role as AuthRole] || [];
  }, [role]);

  const dashboardUrl = useMemo(() => {
    if (role === AuthRole.superAdmin) return "/super-admin";
    if (role === AuthRole.Admin) return "/admin";
    return "/dashboard";
  }, [role]);

  if (!user || !role) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Add actual logout logic from authStore if available
      await authAPI.logout()
      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setLogOutModal(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isActiveLink = (path: string) => {
    const isActive = location.pathname === path;

    return {
      container: isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-primary/10 hover:text-primary",

      icon: isActive
        ? "text-primary-foreground"
        : "text-muted-foreground group-hover:text-primary",

      text: isActive
        ? "text-primary-foreground font-medium"
        : "text-foreground group-hover:text-primary",
    };
  };

  const handleSidebarItemClick = (item: SidebarItem) => {
    if (item.url) {
      // Navigate to the item's URL
      navigate(item.url);
    }
    // Note: Sub-menu expansion functionality can be added here if needed
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-rubik">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col border-r border-border">
          <div className="flex items-center justify-between p-4 mb-8 border-b border-border">
            <div className="flex items-center justify-center">
              <img

                className="w-100 h-auto dark:invert-0 invert"
                alt="Zoni LOGO"
              />
            </div>
            <div className="flex items-center gap-2">

            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-3">
              {sidebarItems.map((item) => {
                const active = isActiveLink(item.url || "");

                return (
                  <button
                    key={item.title}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium cursor-pointer transition-colors",
                      active.container
                    )}
                    onClick={() => handleSidebarItemClick(item)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("transition-colors", active.icon)}>
                        {item.icon}
                      </span>
                      <span className={cn("transition-colors", active.text)}>
                        {item.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-3">
            <div className="space-y-1">
              <button
                onClick={() => setLogOutModal(true)}
                className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image}
                      alt={user?.fullname}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.fullname || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {user?.fullname}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-5 border-b border-border">
            <div className="flex items-center">
              <div className="flex items-center justify-center">
                <img

                  className="h-10 w-auto max-w-full object-contain dark:invert-0 invert"
                  alt="Zoni LOGO"
                />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const active = isActiveLink(item.url || "");

                return (
                  <button
                    key={item.title}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium cursor-pointer transition-colors",
                      active.container
                    )}
                    onClick={() => handleSidebarItemClick(item)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("transition-colors", active.icon)}>
                        {item.icon}
                      </span>
                      <span className={cn("transition-colors", active.text)}>
                        {item.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-3">
            <div className="space-y-1">
              <button
                onClick={() => setLogOutModal(true)}
                className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image}
                      alt={user?.fullname}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.fullname || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {user?.fullname}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "h-screen flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:pl-64" : "md:pl-0"
        )}
      >
        <header className="sticky top-0 z-10 flex h-20 items-center gap-3 border-b bg-background/95 px-8 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <Breadcrumb>
            <BreadcrumbList className="text-muted-foreground">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={dashboardUrl}
                    className="hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to=""
                    className="hover:text-foreground transition-colors"
                  >
                    Pathname
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold"></h1>
            <div className="flex items-center gap-6">
              {/* Theme Toggle */}
              <ThemeToggle />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-2xl relative"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-primary cursor-pointer">
                    <AvatarImage
                      src={user?.image}
                      alt={user?.fullname}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.fullname || "U")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
                >
                  {/* <Profile01
                    name="Muhammad Maigoro"
                    role="Administrator"
                    avatar="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                  /> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-muted/10 overflow-auto">
          <Outlet />
        </main>

        {/* Controlled AlertDialog */}
        <AlertDialog open={logOutModal} onOpenChange={setLogOutModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold">
                Do you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will end your current session. You'll need to login
                again to access the admin panel.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
