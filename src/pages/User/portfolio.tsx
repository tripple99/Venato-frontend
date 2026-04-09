import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { createPortfolioColumns } from "./columns/portfolio-columns";
import type { PortfolioHolding, PortfolioResponse } from "@/model/portfolio.model";
import portfolioService from "@/service/portfolio.service";
import { Skeleton } from "@/components/ui/skeleton";
import { ShimmerTable } from "@/components/ui/shimmerTable";

// Mock data for development
const mockPortfolio: PortfolioResponse = {
  totalPortfolioValue: 847500,
  holdings: {
    data: [
    {
      productName: "Rice",
      quantity: 10,
      unit: "tiya",
      currentPrice: 25000,
      previousPrice: 23000,
      currentValue: 250000,
      percentageChange: 8.7,
      status: "increased",
      otherMarketMaxPrice: 27000,
      otherMarketAvgPrice: 25500,
    },
    {
      productName: "Beans",
      quantity: 8,
      unit: "tiya",
      currentPrice: 20000,
      previousPrice: 21500,
      currentValue: 160000,
      percentageChange: -7.0,
      status: "decreased",
      otherMarketMaxPrice: 22000,
      otherMarketAvgPrice: 20500,
    },
    {
      productName: "Palm Oil",
      quantity: 50,
      unit: "litre",
      currentPrice: 1500,
      previousPrice: 1400,
      currentValue: 75000,
      percentageChange: 7.1,
      status: "increased",
    },
    {
      productName: "Groundnuts",
      quantity: 15,
      unit: "tiya",
      currentPrice: 3000,
      previousPrice: 3200,
      currentValue: 45000,
      percentageChange: -6.3,
      status: "decreased",
    },
    {
      productName: "Sugar",
      quantity: 12,
      unit: "tiya",
      currentPrice: 7000,
      previousPrice: 6800,
      currentValue: 84000,
      percentageChange: 2.9,
      status: "increased",
    },
    {
      productName: "Tomatoes",
      quantity: 30,
      unit: "mudu",
      currentPrice: 5000,
      previousPrice: 4500,
      currentValue: 150000,
      percentageChange: 11.1,
      status: "increased",
    },
    {
      productName: "Yam",
      quantity: 10,
      unit: "tiya",
      currentPrice: 8350,
      previousPrice: 8000,
      currentValue: 83500,
      percentageChange: 4.4,
      status: "increased",
    },
  ],
    totalCount: 7,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    currentPage:1,
    totalPages:1,
    hasNextPage:false,
    hasPreviousPage:false,
    
  });
  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsLoading(true);
      try {
        const response = await portfolioService.getPortfolio(pagination.page, pagination.limit);
        if (response?.payload) {
          setPortfolio(response.payload);
          setPagination({
            page:response.payload.holdings.currentPage,
            limit:response.payload.holdings.limit,
            currentPage:response.payload.holdings.currentPage,
            totalPages:response.payload.holdings.totalPages,
            hasNextPage:response.payload.holdings.hasNextPage,
            hasPreviousPage:response.payload.holdings.hasPreviousPage,
          });
        } else {
          setPortfolio(mockPortfolio);
        }
      } catch {
        setPortfolio(mockPortfolio);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, [pagination.page, pagination.limit]);

  const handleView = (holding: PortfolioHolding) => {
    setSelectedHolding(holding);
    setViewOpen(true);
  };

  const columns = useMemo(() => createPortfolioColumns(handleView), []);

  const kpis = [
    {
      title: "Portfolio Value",
      value: formatPrice(portfolio?.totalPortfolioValue || 0),
      description: "Total estimated value",
      icon: DollarSign,
      color: "text-primary-venato",
      bg: "bg-primary-venato/10",
    },
    {
      title: "Total Items",
      value: portfolio?.holdings?.totalCount || 0,
      description: "Products in portfolio",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Gaining",
      value: portfolio?.holdings?.data?.filter((h) => h.status === "increased").length || 0,
      description: "Products with price increase",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "Declining",
      value: portfolio?.holdings?.data?.filter((h) => h.status === "decreased").length || 0,
      description: "Products with price decrease",
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Portfolio</h1>
        <p className="text-muted-foreground">
          Detailed overview of your product holdings and market performance.
        </p>
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

      {/* Portfolio Holdings Table */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Portfolio Holdings</CardTitle>
          <CardDescription>Track your product investments across markets</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <ShimmerTable columnsCount={columns.length} rowCount={8} />
          ) : (
            <DataTable
              columns={columns}
              data={portfolio?.holdings?.data || []}
              searchKey="productName"
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-venato" />
              Holding Details
            </DialogTitle>
            <DialogDescription>Detailed view of your product holding</DialogDescription>
          </DialogHeader>
          {selectedHolding && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Product</p>
                  <p className="text-lg font-semibold">{selectedHolding.productName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedHolding.status === "increased" ? "success" : "destructive"}>
                    {selectedHolding.status === "increased" ? "▲ Gaining" : "▼ Declining"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/40 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold">
                    {selectedHolding.quantity} {selectedHolding.unit}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-bold text-primary-venato">
                    {formatPrice(selectedHolding.currentValue)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="font-semibold">{formatPrice(selectedHolding.currentPrice)}</p>
                </div>
                <div className="space-y-1 p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Previous Price</p>
                  <p className="font-semibold text-muted-foreground">
                    {formatPrice(selectedHolding.previousPrice)}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  selectedHolding.percentageChange >= 0
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                }`}
              >
                {selectedHolding.percentageChange >= 0 ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownRight className="h-5 w-5" />
                )}
                <span className="font-semibold">
                  {Math.abs(selectedHolding.percentageChange).toFixed(1)}% change from previous
                  price
                </span>
              </div>

              {(selectedHolding.otherMarketMaxPrice || selectedHolding.otherMarketAvgPrice) && (
                <div className="p-4 rounded-lg border border-dashed space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">Other Markets</p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedHolding.otherMarketMaxPrice && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Max Price</p>
                        <p className="font-semibold">
                          {formatPrice(selectedHolding.otherMarketMaxPrice)}
                        </p>
                      </div>
                    )}
                    {selectedHolding.otherMarketAvgPrice && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Avg Price</p>
                        <p className="font-semibold">
                          {formatPrice(selectedHolding.otherMarketAvgPrice)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

