"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { format } from 'date-fns'

interface DemandChartProps {
  data: Array<{
    timestamp: string
    predictedDemand: number
    actualDemand: number | null
    confidence: number
  }>
  formatXAxis: (timestamp: string) => string
  formatTooltip: (value: number, name: string) => string | number
  activeTab: '24h' | '7d' | '30d'
}

export default function DemandChart({ 
  data, 
  formatXAxis, 
  formatTooltip, 
  activeTab 
}: DemandChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={formatXAxis}
          interval="preserveStartEnd"
        />
        <YAxis 
          yAxisId="left"
          label={{ value: 'Demand', angle: -90, position: 'insideLeft' }} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 100]}
          label={{ value: 'Confidence %', angle: 90, position: 'insideRight' }} 
        />
        <Tooltip 
          labelFormatter={(label) => format(new Date(label), activeTab === '30d' ? 'MMM d, yyyy' : 'MMM d, HH:mm')}
          formatter={formatTooltip}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="predictedDemand"
          stroke="#8884d8"
          name="Predicted Demand"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="actualDemand"
          stroke="#82ca9d"
          name="Actual Demand"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="confidence"
          stroke="#ffc658"
          name="Confidence %"
          strokeDasharray="3 3"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 