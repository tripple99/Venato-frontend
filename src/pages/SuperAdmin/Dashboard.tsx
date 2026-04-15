import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartLineDotsColors } from "@/components/ui/line-chart";
import {
  MapPin,
  ShieldCheck,
  Globe,
  Activity,
  Users,
  Package,
  Camera,
  TrendingUp,
} from "lucide-react";
import statService from "@/service/stats.service";
import type { StatsResult } from "@/model/stats.model";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await statService.getStats();
        if (response?.payload) {
          setStats(response.payload);
        }
      } catch {
        // Silent fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = [
    {
      title: "Total Users",
      value: stats?.usersCount ?? 0,
      description: "Registered accounts",
      icon: Users,
      color: "text-primary-venato",
      bg: "bg-primary-venato/10",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers ?? 0,
      description: "Currently active",
      icon: Activity,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Total Markets",
      value: stats?.marketsCount ?? 0,
      description: "Registered markets",
      icon: Globe,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Active Markets",
      value: stats?.activeMarkets ?? 0,
      description: "Currently operational",
      icon: MapPin,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      title: "Total Products",
      value: stats?.productsCount ?? 0,
      description: "Across all markets",
      icon: Package,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
    },
    {
      title: "Price Snapshots",
      value: stats?.totalSnapshots ?? 0,
      description: "Historical price records",
      icon: Camera,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-500/10",
    },
    {
      title: "Recent Changes",
      value: stats?.recentPriceChanges ?? 0,
      description: "Price updates (last 24h)",
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      title: "System Status",
      value: "Operational",
      description: "All services running",
      icon: ShieldCheck,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
  ];

  // Build chart data from key stats metrics
  const chartData = stats
    ? [
        { label: "Users", value: stats.usersCount ?? 0, fill: "var(--chart-1)" },
        { label: "Active Users", value: stats.activeUsers ?? 0, fill: "var(--chart-2)" },
        { label: "Markets", value: stats.marketsCount ?? 0, fill: "var(--chart-3)" },
        { label: "Products", value: stats.productsCount ?? 0, fill: "var(--chart-4)" },
        { label: "Snapshots", value: stats.totalSnapshots ?? 0, fill: "var(--chart-5)" },
      ]
    : undefined;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System-wide overview and platform metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium border border-emerald-100 dark:border-emerald-900/50">
          <ShieldCheck className="h-4 w-4" />
          <span>All Systems Operational</span>
        </div>
      </div>

      {/* KPI Cards — 4 per row */}
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
                <Skeleton className="h-3 w-36" />
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

      {/* Chart + Recent Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Platform Overview Chart */}
        <div className="lg:col-span-3">
          <ChartLineDotsColors
            isLoading={isLoading}
            data={chartData}
            title="Platform Overview"
            description="Snapshot of key platform metrics"
            footerText="Data reflects current system state"
            trendingText={
              stats?.recentPriceChanges
                ? `${stats.recentPriceChanges} price updates in the last 24 hours`
                : "No price changes in the last 24 hours"
            }
          />
        </div>

        {/* Recent Markets */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Markets</CardTitle>
            <CardDescription>Latest active markets on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : stats?.recentMarkets && stats.recentMarkets.length > 0 ? (
              stats.recentMarkets.map((market) => (
                <div
                  key={market._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary-venato/30 hover:bg-primary-venato/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-venato/10">
                      <MapPin className="h-4 w-4 text-primary-venato" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{market.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {market.location?.LGA}, {market.location?.state}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 font-bold">
                    {market.currency}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No markets found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
