'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResponsiveContainer, FunnelChart as RechartsFunnel, Funnel, LabelList, Tooltip } from 'recharts'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface FleetFunnelData {
  name: string
  value: number
  conversion?: number
}

interface FunnelChartProps {
  title?: string
  data: FleetFunnelData[]
  loading?: boolean
  showConversionRates?: boolean
  onDateRangeChange?: (range: string) => void
}

const COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <Card className="p-2 shadow-lg">
        <CardContent className="p-2">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">Count: {data.value}</p>
          {data.conversion && (
            <p className="text-sm text-muted-foreground">
              Conversion: {data.conversion.toFixed(1)}%
            </p>
          )}
        </CardContent>
      </Card>
    )
  }
  return null
}

export function FunnelChart({
  title = "Fleet Status Funnel",
  data,
  loading,
  showConversionRates = true,
  onDateRangeChange
}: FunnelChartProps) {
  // Calculate conversion rates between steps
  const dataWithConversions = data.map((item, index) => {
    if (index === 0) return { ...item }
    const previousValue = data[index - 1].value
    const conversion = (item.value / previousValue) * 100
    return { ...item, conversion }
  })

  if (!data || data.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No fleet data available for the selected period.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        {title && <h3 className="font-medium">{title}</h3>}
        {onDateRangeChange && (
          <Select
            defaultValue="7d"
            onValueChange={(value) => onDateRangeChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="h-[400px] w-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsFunnel>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                data={dataWithConversions}
                dataKey="value"
                nameKey="name"
                isAnimationActive
                fill="#4F46E5"
                gradient
              >
                <LabelList
                  position="right"
                  fill="#000"
                  stroke="none"
                  dataKey="name"
                />
                {showConversionRates && (
                  <LabelList
                    position="right"
                    fill="#666"
                    stroke="none"
                    dataKey={(entry: FleetFunnelData) => entry.conversion ? `${entry.conversion.toFixed(1)}%` : ''}
                    offset={60}
                  />
                )}
              </Funnel>
            </RechartsFunnel>
          </ResponsiveContainer>
        )}
      </div>

      {/* Fleet Status Summary */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dataWithConversions.map((item, index) => (
          <Card key={item.name} className="p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              {index > 0 && (
                <CardDescription className="text-xs">
                  {item.conversion?.toFixed(1)}% from previous
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  )
}
