"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { usePortfolio } from "@/context/portfolio-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/utils"

export function PortfolioChart() {
  const { totalValue, portfolioHistory } = usePortfolio()
  const [timeRange, setTimeRange] = useState("1d")

  // Use real portfolio history, always append the current value for today (in case it changed)
  const today = new Date().toISOString().split("T")[0]
  let chartData = portfolioHistory
  if (chartData.length === 0 || chartData[chartData.length - 1].date !== today || chartData[chartData.length - 1].value !== totalValue) {
    chartData = [...chartData, { date: today, value: totalValue }]
  }

  // Filter data based on selected time range
  const getFilteredData = () => {
    const now = new Date()
    const cutoffDate = new Date()

    if (timeRange === "1d") {
      cutoffDate.setDate(now.getDate() - 1)
    } else if (timeRange === "1w") {
      cutoffDate.setDate(now.getDate() - 7)
    } else if (timeRange === "1m") {
      cutoffDate.setMonth(now.getMonth() - 1)
    } else if (timeRange === "3m") {
      cutoffDate.setMonth(now.getMonth() - 3)
    } else if (timeRange === "6m") {
      cutoffDate.setMonth(now.getMonth() - 6)
    } else {
      cutoffDate.setFullYear(now.getFullYear() - 1)
    }

    return chartData.filter((item) => new Date(item.date) >= cutoffDate)
  }

  const filteredData = getFilteredData()

  const formatXAxis = (date: string) => {
    const d = new Date(date)
    if (timeRange === "1d") {
      return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`
    }
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const formatYAxis = (value: number) => {
    return formatCurrency(value).replace(".00", "")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Track your portfolio value over time</CardDescription>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[300px]"
          config={{
            value: {
              label: "Portfolio Value",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatXAxis} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                name="Portfolio Value"
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
