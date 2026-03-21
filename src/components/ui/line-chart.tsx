
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

export const description = "A line chart with dots and colors"

const chartData = [
  { product: "Wheat", stock: 120, fill: "var(--color-wheat)" },
  { product: "Maize", stock: 80, fill: "var(--color-maize)" },
  { product: "Rice", stock: 150, fill: "var(--color-rice)" },
  { product: "Sorghum", stock: 70, fill: "var(--color-sorghum)" },
  { product: "Millet", stock: 90, fill: "var(--color-millet)" },
]

const chartConfig = {
  stock: {
    label: "Stock",
    color: "var(--chart-2)",
  },
  wheat: {
    label: "Wheat",
    color: "var(--chart-1)",
  },
  maize: {
    label: "Maize",
    color: "var(--chart-2)",
  },
  rice: {
    label: "Rice",
    color: "var(--chart-3)",
  },
  sorghum: {
    label: "Sorghum",
    color: "var(--chart-4)",
  },
  millet: {
    label: "Millet",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig


export function ChartLineDotsColors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Dots Colors</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="stock"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="stock"
              type="natural"
              stroke="var(--color-stock)"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.product}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill}
                    stroke={payload.fill}
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
