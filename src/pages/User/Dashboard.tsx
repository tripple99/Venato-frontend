import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  Package, 
  Eye, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Minus 
} from "lucide-react";
import statService from "@/service/stats.service";
import type { StatsResult } from "@/model/stats.model";
import { ChartLineDotsColors } from "@/components/ui/line-chart";
import { Skeleton } from "@/components/ui/skeleton";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

export default function UserDashboard() {
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await statService.getStats();
        if (response?.payload) {
          setStats(response.payload);
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusDetails = () => {
    const status = stats?.inventoryStatus || 'stable';
    const change = stats?.inventoryValueChange || 0;
    
    if (status === 'increased') {
        return {
            Icon: TrendingUp,
            label: `+${change}% this month`,
            className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
        };
    } else if (status === 'decreased') {
        return {
            Icon: TrendingDown,
            label: `${change}% this month`,
            className: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/50"
        };
    } else {
        return {
            Icon: Minus,
            label: "Stable (No change)",
            className: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
        };
    }
  }

  const status = getStatusDetails();

  const kpis = [
    {
      title: "Portfolio Value",
      value: formatPrice(stats?.totalInventoryValue || 0),
      description: "Estimated total value",
      icon: DollarSign,
      color: "text-primary-venato",
      bg: "bg-primary-venato/10",
    },
    {
      title: "Inventory Items",
      value: stats?.inventoryItems || 0,
      description: "Active products",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Watchlist",
      value: stats?.watchlistCount || 0,
      description: "Tracked products",
      icon: Eye,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "Active Alerts",
      value: stats?.activeAlerts || 0,
      description: "Price notifications",
      icon: Bell,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  // Mock trend data for the chart (representing growth over time)
  const currentVal = stats?.totalInventoryValue || 0;
  const trendData = [
    { label: "Jan", value: currentVal * 0.8 },
    { label: "Feb", value: currentVal * 0.85 },
    { label: "Mar", value: currentVal * 0.92 },
    { label: "Apr", value: currentVal * 0.88 },
    { label: "May", value: currentVal * 0.95 },
    { label: "Jun", value: currentVal },
  ].map((d, i) => ({
    ...d,
    fill: `var(--chart-${(i % 5) + 1})`
  }));

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your portfolio and market activity.
          </p>
        </div>
        
        {isLoading ? (
            <Skeleton className="h-10 w-40 rounded-full" />
        ) : (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${status.className}`}>
                <status.Icon className="h-4 w-4" />
                <span>{status.label}</span>
            </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.title}
            className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300"
          >
            {isLoading ? (
               <div className="p-6 space-y-3">
                 <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                 </div>
                 <Skeleton className="h-8 w-32" />
                 <Skeleton className="h-3 w-40" />
               </div>
            ) : (
              <>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2">
          <ChartLineDotsColors 
            isLoading={isLoading}
            data={trendData}
            title="Portfolio Performance"
            description="Estimated value growth over the last 6 months"
            footerText="Data includes current market fluctuations"
            trendingText="Growth is up by 8.4% since last quarter"
          />
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Market Insights</CardTitle>
              <CardDescription>Stay updated with market changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium">Rice Prices Rising</h4>
                        <p className="text-xs text-muted-foreground">Prices in northern markets have increased by 5% today.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium">New Market Available</h4>
                        <p className="text-xs text-muted-foreground">A new wholesale market in Jos has been added to the system.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium">Tomatoes Overstock</h4>
                        <p className="text-xs text-muted-foreground">Significant price drops expected due to seasonal surplus.</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
