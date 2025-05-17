"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { cn } from "@/lib/cn"
import { Skeleton } from "components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

interface RevenueData {
  total: number
  change: number
  history: Array<{
    date: string
    value: number
  }>
  forecast: Array<{
    date: string
    value: number
  }>
}

interface RevenueWidgetProps {
  className?: string
}

const RevenueWidget = ({ className }: RevenueWidgetProps) => {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch('/api/revenue')
        if (!response.ok) throw new Error('Failed to fetch revenue data')
        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load revenue')
      } finally {
        setLoading(false)
      }
    }

    fetchRevenue()
    // Refresh every 5 minutes
    const interval = setInterval(fetchRevenue, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Failed to load revenue data
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = [...data.history, ...data.forecast]

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${data.total.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.change > 0 ? '+' : ''}{data.change}% from last month
            </p>
          </div>

          <div className="h-[200px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  content={(props: TooltipProps<ValueType, NameType>) => {
                    const { active, payload } = props
                    if (active && payload?.[0]) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-2">
                          <p className="text-sm font-medium">
                            ${payload[0].value?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payload[0].payload.date}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RevenueWidget
