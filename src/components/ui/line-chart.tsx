
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Dot, Line, LineChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { Skeleton } from "@/components/ui/skeleton"

export const description = "A line chart with dots and colors"

export interface ChartDataPoint {
  label: string;
  value: number;
  fill?: string;
}

interface ChartProps {
  data?: ChartDataPoint[];
  title?: string;
  description?: string;
  footerText?: string;
  trendingText?: string;
  isLoading?: boolean;
}

const defaultChartData: ChartDataPoint[] = [
  { label: "Wheat", value: 120, fill: "var(--color-wheat)" },
  { label: "Maize", value: 80, fill: "var(--color-maize)" },
  { label: "Rice", value: 150, fill: "var(--color-rice)" },
  { label: "Sorghum", value: 70, fill: "var(--color-sorghum)" },
  { label: "Millet", value: 90, fill: "var(--color-millet)" },
]

const defaultChartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineDotsColors({ 
  data = defaultChartData, 
  title = "Product Analytics", 
  description = "Recent product price trends",
  footerText = "Showing latest product entries",
  trendingText = "Trending up by 5.2% this month",
  isLoading = false
}: ChartProps) {
  console.log("data", data);
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex flex-col justify-end gap-2">
            <div className="flex items-end gap-4 h-full px-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="flex-1 w-full" style={{ height: `${20 + i * 15}%` }} />
              ))}
            </div>
            <div className="flex justify-between px-4 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 pt-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={defaultChartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 24,
              left: 24,
              right: 24,
              bottom: 12, // Added bottom margin for breathing room
            }}
          >
            <defs>
              <filter id="shadow" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="4" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="value"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="value"
              type="monotone" // Changed from natural to monotone to prevent undershoot
              stroke="var(--chart-2)"
              strokeWidth={4}
              filter="url(#shadow)"
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.label}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill || "var(--chart-2)"}
                    stroke={payload.fill || "var(--chart-2)"}
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {trendingText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {footerText}
        </div>
      </CardFooter>
    </Card>
  )
}
