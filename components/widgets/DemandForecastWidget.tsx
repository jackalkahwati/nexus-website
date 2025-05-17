"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import dynamic from 'next/dynamic'
import { format, subHours, addHours, subDays, addDays, formatISO } from 'date-fns'

const DemandChart = dynamic(
  () => import('./DemandChart'),
  {
    ssr: false,
    loading: () => <div className="h-[400px] w-full animate-pulse bg-gray-200 dark:bg-gray-800" />
  }
)

// Generate mock data for different time ranges
const generateMockData = (timeRange: '24h' | '7d' | '30d') => {
  const data = []
  const now = new Date()
  let interval: number
  let pastPoints: number
  let futurePoints: number
  let formatTick: (date: Date) => string

  switch (timeRange) {
    case '7d':
      interval = 4 // 4-hour intervals
      pastPoints = 42 // 7 days * 6 points per day
      futurePoints = 6 // 1 day ahead
      formatTick = (date) => format(date, 'EEE')
      break
    case '30d':
      interval = 24 // daily intervals
      pastPoints = 30 // 30 days
      futurePoints = 3 // 3 days ahead
      formatTick = (date) => format(date, 'MMM d')
      break
    default: // 24h
      interval = 1 // hourly intervals
      pastPoints = 24 // 24 hours
      futurePoints = 6 // 6 hours ahead
      formatTick = (date) => format(date, 'HH:mm')
  }

  // Generate past data
  for (let i = pastPoints; i >= 0; i--) {
    const time = timeRange === '24h' 
      ? subHours(now, i)
      : timeRange === '7d'
      ? subHours(now, i * 4)
      : subDays(now, i)

    const baseValue = timeRange === '30d'
      ? 300 + Math.sin(i / 3) * 50 // Monthly pattern
      : timeRange === '7d'
      ? 200 + Math.sin(i / 6) * 30 // Weekly pattern
      : 30 + Math.sin(i / 4) * 10 // Daily pattern

    data.push({
      timestamp: formatISO(time),
      predictedDemand: Math.floor(baseValue + (Math.random() * 20) - 10),
      actualDemand: i > 0 ? Math.floor(baseValue + (Math.random() * 20) - 10) : null,
      confidence: 95 - (Math.random() * 10)
    })
  }

  // Add future predictions
  for (let i = 1; i <= futurePoints; i++) {
    const time = timeRange === '24h'
      ? addHours(now, i)
      : timeRange === '7d'
      ? addHours(now, i * 4)
      : addDays(now, i)

    const baseValue = timeRange === '30d'
      ? 300 + Math.sin((pastPoints + i) / 3) * 50
      : timeRange === '7d'
      ? 200 + Math.sin((pastPoints + i) / 6) * 30
      : 30 + Math.sin((pastPoints + i) / 4) * 10

    data.push({
      timestamp: formatISO(time),
      predictedDemand: Math.floor(baseValue + (Math.random() * 20) - 10),
      confidence: Math.max(50, 85 - (i * (timeRange === '30d' ? 5 : timeRange === '7d' ? 3 : 2)))
    })
  }

  return { data, formatTick }
}

export default function DemandForecastWidget() {
  const [activeTab, setActiveTab] = useState<'24h' | '7d' | '30d'>('24h')
  const [{ data, formatTick }, setChartData] = useState(generateMockData('24h'))

  useEffect(() => {
    setChartData(generateMockData(activeTab))
  }, [activeTab])

  // Format tooltip values
  const formatTooltip = (value: number, name: string) => {
    if (name === 'confidence') return `${value.toFixed(1)}%`
    return value
  }

  // Format X-axis ticks
  const formatXAxis = (timestamp: string) => {
    return formatTick(new Date(timestamp))
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Demand Forecast</h3>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as '24h' | '7d' | '30d')}>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[400px] w-full">
        <DemandChart 
          data={data}
          formatXAxis={formatXAxis}
          formatTooltip={formatTooltip}
          activeTab={activeTab}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Current Demand</p>
          <p className="text-2xl font-bold">{data[data.length - 7]?.actualDemand || '—'}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Predicted Peak</p>
          <p className="text-2xl font-bold">
            {Math.max(...data.map(d => d.predictedDemand))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Avg Confidence</p>
          <p className="text-2xl font-bold">
            {(data.reduce((acc, d) => acc + d.confidence, 0) / data.length).toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  )
} 