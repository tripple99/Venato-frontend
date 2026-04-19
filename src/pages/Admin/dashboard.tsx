import { useEffect, useState } from "react";
import { ChartLineDotsColors } from "@/components/ui/line-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, MapPin, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import statsService from "@/service/stats.service";
import type { StatsResult } from "@/model/stats.model";

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await statsService.getStats();
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
      title: "Total Products",
      value: stats?.totalProductsListed ?? 0,
      description: "Products in your market",
      icon: Package,
      color: "text-primary-venato",
      bg: "bg-primary-venato/10",
    },
    {
      title: "Market Assigned",
      value: stats?.assignedMarkets ?? 0,
      description: "Your assigned markets",
      icon: MapPin,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Market Activity",
      value: stats?.marketActivity ?? 0,
      description: "Recent market updates",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your market operations and product metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Charts & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <ChartLineDotsColors 
            isLoading={isLoading}
            data={stats?.recentProducts?.slice(0, 6).map((p, i) => ({
                label: p.name,
                value: p.price,
                fill: `var(--chart-${(i % 5) + 1})`
            }))}
            title="Price Overview"
            description="Comparing recent product prices in your market"
            footerText="Snapshot of current market pricing"
            trendingText={stats?.marketActivity === 0 ? "Market activity is steady" : "Recent spikes in market activity"}
          />
        </div>

        {/* Recent Products */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Products</CardTitle>
            <CardDescription>Latest products in your market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 w-full">
                       <Skeleton className="h-10 w-10 rounded-lg" />
                       <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                       </div>
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : stats?.recentProducts && stats.recentProducts.length > 0 ? (
              stats.recentProducts.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary-venato/30 hover:bg-primary-venato/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-venato/10">
                      <Package className="h-4 w-4 text-primary-venato" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                        {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">per {product.unit}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No products yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}