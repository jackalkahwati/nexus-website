"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { useAnalytics } from '@/contexts/AnalyticsContext'
import { MetricsChart } from '@/components/analytics/MetricsChart'
import { FunnelChart } from '@/components/analytics/FunnelChart'
import { TopDimensionsChart } from '@/components/analytics/TopDimensionsChart'
import { DownloadReports } from '@/components/analytics/DownloadReports'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { addDays, subDays, format } from 'date-fns'
import { Calendar, BarChart3, TrendingUp, Users, Download, Signal, Battery, AlertTriangle, Wifi, Gauge, Route, Car, Activity, BatteryCharging, LineChart as LineChartIcon, ShieldAlert, MapPin, Clock, Timer, CheckCircle2, Settings as Tool, DollarSign, Shield, TrendingDown, Link2, Network, Webhook, Database, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetricData } from '@/types/analytics'

type IntervalType = 'hour' | 'day' | 'week' | 'month'

type AnalyticsCategory = 'fleet-utilization' | 'vehicle-status' | 'maintenance' | 'location' | 'battery' | 'usage' | 'incidents' | 'iot' | 'integrations'

interface AnalyticsCategoryConfig {
  label: string
  value: AnalyticsCategory
  icon: React.ReactNode
  description: string
}

const analyticsCategories: AnalyticsCategoryConfig[] = [
  {
    label: 'Fleet Utilization',
    value: 'fleet-utilization',
    icon: <Gauge className="h-4 w-4" />,
    description: 'Vehicle usage, efficiency, and capacity metrics'
  },
  {
    label: 'Vehicle Status',
    value: 'vehicle-status',
    icon: <Car className="h-4 w-4" />,
    description: 'Current status distribution of all vehicles'
  },
  {
    label: 'Maintenance Records',
    value: 'maintenance',
    icon: <Activity className="h-4 w-4" />,
    description: 'Service history, costs, and compliance'
  },
  {
    label: 'Location History',
    value: 'location',
    icon: <MapPin className="h-4 w-4" />,
    description: 'Vehicle movement patterns and hotspots'
  },
  {
    label: 'Battery Health',
    value: 'battery',
    icon: <BatteryCharging className="h-4 w-4" />,
    description: 'Battery performance and lifecycle metrics'
  },
  {
    label: 'Usage Patterns',
    value: 'usage',
    icon: <LineChartIcon className="h-4 w-4" />,
    description: 'Operational trends and patterns'
  },
  {
    label: 'Incident Reports',
    value: 'incidents',
    icon: <ShieldAlert className="h-4 w-4" />,
    description: 'Safety events and incident analysis'
  },
  {
    label: 'IoT Analytics',
    value: 'iot',
    icon: <Signal className="h-4 w-4" />,
    description: 'Device connectivity and performance'
  },
  {
    label: 'Integrations',
    value: 'integrations',
    icon: <Link2 className="h-4 w-4" />,
    description: 'External services and data connections'
  }
]

// Mock fleet data - replace with actual API calls
const mockFleetMetrics = {
  metrics: [
    // IoT Connectivity Metrics
    {
      timestamp: new Date(),
      value: 98,
      metricName: 'deviceConnectivity',
      dimensions: { type: 'connectivity', status: 'connected', metric: 'percentage' }
    },
    {
      timestamp: new Date(Date.now() - 3600000),
      value: 97,
      metricName: 'deviceConnectivity',
      dimensions: { type: 'connectivity', status: 'connected', metric: 'percentage' }
    },
    {
      timestamp: new Date(Date.now() - 7200000),
      value: 99,
      metricName: 'deviceConnectivity',
      dimensions: { type: 'connectivity', status: 'connected', metric: 'percentage' }
    },
    // Signal Strength Metrics
    {
      timestamp: new Date(),
      value: 85,
      metricName: 'signalStrength',
      dimensions: { type: 'network', metric: 'signal', status: 'normal' }
    },
    {
      timestamp: new Date(Date.now() - 3600000),
      value: 82,
      metricName: 'signalStrength',
      dimensions: { type: 'network', metric: 'signal', status: 'normal' }
    },
    // Fleet Operations Metrics
    {
      timestamp: new Date(),
      value: 85,
      metricName: 'vehicleUtilization',
      dimensions: { type: 'operations', metric: 'percentage', status: 'active' }
    },
    {
      timestamp: new Date(),
      value: 92,
      metricName: 'routeEfficiency',
      dimensions: { type: 'operations', metric: 'percentage', status: 'optimal' }
    },
    {
      timestamp: new Date(),
      value: 78,
      metricName: 'fuelEfficiency',
      dimensions: { type: 'operations', metric: 'mpg', status: 'normal' }
    },
    // Maintenance Metrics
    {
      timestamp: new Date(),
      value: 95,
      metricName: 'maintenanceCompliance',
      dimensions: { type: 'maintenance', metric: 'percentage', status: 'compliant' }
    },
    {
      timestamp: new Date(),
      value: 88,
      metricName: 'vehicleHealth',
      dimensions: { type: 'maintenance', metric: 'percentage', status: 'good' }
    }
  ],
  realTimeMetrics: [
    // Device Health
    {
      timestamp: new Date(),
      value: 45,
      metricName: 'activeDevices',
      dimensions: { type: 'iot', status: 'active', metric: 'count' }
    },
    {
      timestamp: new Date(),
      value: 3,
      metricName: 'lowBatteryDevices',
      dimensions: { type: 'iot', status: 'warning', metric: 'count' }
    },
    {
      timestamp: new Date(),
      value: 2,
      metricName: 'disconnectedDevices',
      dimensions: { type: 'iot', status: 'error', metric: 'count' }
    },
    // Network Performance
    {
      timestamp: new Date(),
      value: 250,
      metricName: 'latency',
      dimensions: { type: 'network', metric: 'ms', status: 'normal' }
    },
    {
      timestamp: new Date(),
      value: 99.9,
      metricName: 'uptime',
      dimensions: { type: 'network', metric: 'percentage', status: 'normal' }
    },
    // Real-time Operations Metrics
    {
      timestamp: new Date(),
      value: 42,
      metricName: 'activeVehicles',
      dimensions: { type: 'operations', status: 'active', metric: 'count' }
    },
    {
      timestamp: new Date(),
      value: 3,
      metricName: 'idleVehicles',
      dimensions: { type: 'operations', status: 'idle', metric: 'count' }
    },
    {
      timestamp: new Date(),
      value: 5,
      metricName: 'maintenanceRequired',
      dimensions: { type: 'maintenance', status: 'warning', metric: 'count' }
    }
  ],
  funnelSteps: [
    { name: 'Total Devices', value: 100 },
    { name: 'Connected', value: 98 },
    { name: 'Data Streaming', value: 95 },
    { name: 'Healthy Status', value: 92 },
  ],
  topLocations: [
    { value: 'Downtown Hub', count: 30, percentage: 30, dimension: 'Signal: 95%' },
    { value: 'Airport Zone', count: 25, percentage: 25, dimension: 'Signal: 92%' },
    { value: 'University Area', count: 20, percentage: 20, dimension: 'Signal: 88%' },
    { value: 'Shopping District', count: 15, percentage: 15, dimension: 'Signal: 85%' },
    { value: 'Industrial Park', count: 10, percentage: 10, dimension: 'Signal: 82%' },
  ],
  // New Performance Metrics
  performanceMetrics: [
    { name: 'Average Trip Duration', value: '45 mins', trend: 'up', change: '+5%' },
    { name: 'Fuel Efficiency', value: '28 MPG', trend: 'up', change: '+3%' },
    { name: 'Maintenance Cost', value: '$2.4k/mo', trend: 'down', change: '-8%' },
    { name: 'Route Optimization', value: '92%', trend: 'up', change: '+4%' }
  ],
  // Maintenance Stats
  maintenanceStats: [
    { name: 'Scheduled Services', completed: 45, pending: 5, overdue: 2 },
    { name: 'Repairs', completed: 12, pending: 3, overdue: 0 },
    { name: 'Inspections', completed: 38, pending: 7, overdue: 1 }
  ],
  // Environmental Impact
  environmentalMetrics: [
    { name: 'Carbon Footprint', value: '-15%', target: '-20%' },
    { name: 'Fuel Efficiency', value: '+10%', target: '+15%' },
    { name: 'Eco Score', value: '85/100', target: '90/100' }
  ]
}

// Mock data for vehicle status
const vehicleStatusData = [
  { label: 'Available', value: 42, color: 'bg-green-500' },
  { label: 'In Use', value: 35, color: 'bg-blue-500' },
  { label: 'Maintenance', value: 8, color: 'bg-orange-500' },
  { label: 'Out of Service', value: 5, color: 'bg-red-500' }
]

// Mock data for maintenance history
const maintenanceHistoryData = [
  { date: '2024-01', scheduled: 45, unscheduled: 12 },
  { date: '2024-02', scheduled: 42, unscheduled: 8 },
  { date: '2024-03', scheduled: 48, unscheduled: 15 },
  { date: '2024-04', scheduled: 40, unscheduled: 10 }
]

// Mock data for location history
const locationHistoryData = [
  { location: 'Downtown Hub', visits: 450, duration: 120, distance: 850 },
  { location: 'Airport Zone', visits: 380, duration: 90, distance: 1200 },
  { location: 'University Area', visits: 320, duration: 75, distance: 650 },
  { location: 'Shopping District', visits: 280, duration: 60, distance: 450 },
  { location: 'Industrial Park', visits: 220, duration: 45, distance: 950 }
]

// Mock data for integrations
const integrationsData = {
  apis: [
    { name: 'Weather API', status: 'active', requests: 15420, errors: 23, latency: 145 },
    { name: 'Maps API', status: 'active', requests: 28350, errors: 45, latency: 165 },
    { name: 'Traffic API', status: 'degraded', requests: 12840, errors: 128, latency: 285 },
    { name: 'Geocoding API', status: 'active', requests: 8920, errors: 12, latency: 125 }
  ],
  webhooks: [
    { name: 'Event Notifications', status: 'active', delivered: 2840, failed: 12, lastTriggered: '2 mins ago' },
    { name: 'Alert System', status: 'active', delivered: 1250, failed: 5, lastTriggered: '15 mins ago' },
    { name: 'Data Sync', status: 'inactive', delivered: 850, failed: 28, lastTriggered: '1 hour ago' },
    { name: 'Backup Service', status: 'active', delivered: 450, failed: 0, lastTriggered: '30 mins ago' }
  ],
  databases: [
    { name: 'Vehicle Data', status: 'healthy', connections: 45, queryLatency: 25, size: '1.2 TB' },
    { name: 'User Analytics', status: 'healthy', connections: 28, queryLatency: 18, size: '850 GB' },
    { name: 'Telemetry Store', status: 'warning', connections: 52, queryLatency: 45, size: '2.8 TB' },
    { name: 'Event Log', status: 'healthy', connections: 15, queryLatency: 12, size: '500 GB' }
  ],
  custom: [
    { name: 'Fleet Manager', type: 'service', status: 'operational', uptime: '99.9%', lastSync: '5 mins ago' },
    { name: 'Route Optimizer', type: 'algorithm', status: 'operational', uptime: '99.7%', lastSync: '2 mins ago' },
    { name: 'Maintenance Predictor', type: 'ML model', status: 'training', uptime: '98.5%', lastSync: '15 mins ago' },
    { name: 'Risk Analyzer', type: 'ML model', status: 'operational', uptime: '99.8%', lastSync: '8 mins ago' }
  ]
}

// Chart components
function DonutChart({ data }: { data: typeof vehicleStatusData }) {
  const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#ef4444']
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function MaintenanceHistoryChart({ data }: { data: typeof maintenanceHistoryData }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="scheduled" fill="#3b82f6" name="Scheduled" />
          <Bar dataKey="unscheduled" fill="#f97316" name="Unscheduled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function BatteryHealthChart({ data }: { data: Array<{ timestamp: string; health: number; cycles: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="health" stroke="#3b82f6" name="Health %" />
          <Line yAxisId="right" type="monotone" dataKey="cycles" stroke="#f97316" name="Cycles" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function UsagePatternChart({ data }: { data: Array<{ hour: number; usage: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="usage" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function IncidentChart({ data }: { data: Array<{ month: string; incidents: number; severity: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="incidents" stroke="#ef4444" name="Incidents" />
          <Line yAxisId="right" type="monotone" dataKey="severity" stroke="#f97316" name="Avg Severity" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function LocationHistoryChart({ data }: { data: typeof locationHistoryData }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="location" type="category" width={120} />
          <Tooltip />
          <Legend />
          <Bar dataKey="visits" name="Total Visits" fill="#3b82f6" />
          <Bar dataKey="duration" name="Avg Duration (min)" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Mock data for new charts
const batteryHealthData = [
  { timestamp: '2024-01', health: 100, cycles: 0 },
  { timestamp: '2024-02', health: 98, cycles: 50 },
  { timestamp: '2024-03', health: 95, cycles: 100 },
  { timestamp: '2024-04', health: 92, cycles: 150 },
]

const usagePatternData = [
  { hour: 0, usage: 20 },
  { hour: 4, usage: 15 },
  { hour: 8, usage: 85 },
  { hour: 12, usage: 70 },
  { hour: 16, usage: 90 },
  { hour: 20, usage: 45 },
]

const incidentData = [
  { month: 'Jan', incidents: 5, severity: 2.5 },
  { month: 'Feb', incidents: 3, severity: 1.8 },
  { month: 'Mar', incidents: 7, severity: 3.2 },
  { month: 'Apr', incidents: 4, severity: 2.1 },
]

// Transform the metrics data to match the MetricsChart component's expected format
function transformMetricsData(metrics: typeof mockFleetMetrics.metrics): MetricData[] {
  return metrics.map(metric => ({
    timestamp: metric.timestamp,
    value: metric.value,
    metricName: metric.metricName,
    dimensions: metric.dimensions
  }))
}

// Add new chart components
function FleetEfficiencyChart({ data }: { data: Array<{ date: string; efficiency: number; target: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" name="Actual" />
          <Line type="monotone" dataKey="target" stroke="#22c55e" name="Target" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function VehicleUtilizationChart({ data }: { data: Array<{ hour: number; weekday: number; value: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Utilization %" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function IoTHealthChart({ data }: { data: Array<{ timestamp: string; connected: number; disconnected: number; warning: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="connected" stackId="a" fill="#22c55e" name="Connected" />
          <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
          <Bar dataKey="disconnected" stackId="a" fill="#ef4444" name="Disconnected" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function NetworkPerformanceChart({ data }: { data: Array<{ timestamp: string; latency: number; packetLoss: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#3b82f6" name="Latency (ms)" />
          <Line yAxisId="right" type="monotone" dataKey="packetLoss" stroke="#f59e0b" name="Packet Loss %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Add mock data for new charts
const fleetEfficiencyData = [
  { date: '2024-01', efficiency: 88, target: 90 },
  { date: '2024-02', efficiency: 91, target: 90 },
  { date: '2024-03', efficiency: 89, target: 90 },
  { date: '2024-04', efficiency: 92, target: 90 },
]

const vehicleUtilizationData = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  weekday: Math.floor(Math.random() * 7),
  value: 30 + Math.floor(Math.random() * 50)
}))

const iotHealthData = [
  { timestamp: '00:00', connected: 45, warning: 3, disconnected: 2 },
  { timestamp: '06:00', connected: 44, warning: 4, disconnected: 2 },
  { timestamp: '12:00', connected: 46, warning: 2, disconnected: 2 },
  { timestamp: '18:00', connected: 43, warning: 5, disconnected: 2 },
]

const networkPerformanceData = [
  { timestamp: '00:00', latency: 120, packetLoss: 0.2 },
  { timestamp: '06:00', latency: 150, packetLoss: 0.3 },
  { timestamp: '12:00', latency: 180, packetLoss: 0.4 },
  { timestamp: '18:00', latency: 140, packetLoss: 0.2 },
]

// Add new chart components
function VehicleStatusTrendChart({ data }: { data: Array<{ date: string; available: number; inUse: number; maintenance: number; outOfService: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="available" stackId="1" stroke="#22c55e" fill="#22c55e" name="Available" />
          <Area type="monotone" dataKey="inUse" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="In Use" />
          <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#f97316" fill="#f97316" name="Maintenance" />
          <Area type="monotone" dataKey="outOfService" stackId="1" stroke="#ef4444" fill="#ef4444" name="Out of Service" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function MaintenanceCostChart({ data }: { data: Array<{ month: string; planned: number; unplanned: number; total: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="planned" fill="#3b82f6" name="Planned Cost" />
          <Bar yAxisId="left" dataKey="unplanned" fill="#f97316" name="Unplanned Cost" />
          <Line yAxisId="right" type="monotone" dataKey="total" stroke="#22c55e" name="Total Cost" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function ServiceTypeChart({ data }: { data: typeof mockFleetMetrics.maintenanceStats }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" name="Completed" fill="#22c55e" stackId="a" />
          <Bar dataKey="pending" name="Pending" fill="#f97316" stackId="a" />
          <Bar dataKey="overdue" name="Overdue" fill="#ef4444" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function BatteryChargingChart({ data }: { data: Array<{ hour: number; charging: number; available: number; low: number }> }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="charging" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Charging" />
          <Area type="monotone" dataKey="available" stackId="1" stroke="#22c55e" fill="#22c55e" name="Available" />
          <Area type="monotone" dataKey="low" stackId="1" stroke="#f97316" fill="#f97316" name="Low Battery" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Add mock data for new charts
const vehicleStatusTrendData = [
  { date: '2024-01', available: 40, inUse: 35, maintenance: 8, outOfService: 7 },
  { date: '2024-02', available: 42, inUse: 33, maintenance: 10, outOfService: 5 },
  { date: '2024-03', available: 38, inUse: 38, maintenance: 7, outOfService: 7 },
  { date: '2024-04', available: 42, inUse: 35, maintenance: 8, outOfService: 5 },
]

const maintenanceCostData = [
  { month: 'Jan', planned: 15000, unplanned: 5000, total: 20000 },
  { month: 'Feb', planned: 14000, unplanned: 3000, total: 17000 },
  { month: 'Mar', planned: 16000, unplanned: 6000, total: 22000 },
  { month: 'Apr', planned: 15500, unplanned: 4500, total: 20000 },
]

const batteryChargingData = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  charging: Math.floor(Math.random() * 15) + 5,
  available: Math.floor(Math.random() * 20) + 20,
  low: Math.floor(Math.random() * 5) + 1,
}))

// Add new chart components for integrations
function APIMetricsChart({ data }: { data: typeof integrationsData.apis }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="requests" fill="#3b82f6" name="Requests (K)" />
          <Bar yAxisId="left" dataKey="errors" fill="#ef4444" name="Errors" />
          <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#22c55e" name="Latency (ms)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function WebhookPerformanceChart({ data }: { data: typeof integrationsData.webhooks }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="delivered" stackId="a" fill="#22c55e" name="Delivered" />
          <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function DatabaseMetricsChart({ data }: { data: typeof integrationsData.databases }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="connections" fill="#3b82f6" name="Active Connections" />
          <Line yAxisId="right" type="monotone" dataKey="queryLatency" stroke="#f97316" name="Query Latency (ms)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date()
  })
  const [interval, setInterval] = useState<IntervalType>('hour')
  const [selectedCategory, setSelectedCategory] = useState<AnalyticsCategory>('fleet-utilization')
  const [isLoading, setIsLoading] = useState(false)

  const metricTypes = [
    { value: 'deviceConnectivity', label: 'Device Connectivity' },
    { value: 'signalStrength', label: 'Signal Strength' },
    { value: 'latency', label: 'Network Latency' },
    { value: 'batteryLevels', label: 'Battery Levels' },
  ]

  // Transform metrics data to match component requirements
  const transformedMetrics = React.useMemo(() => {
    const filteredMetrics = mockFleetMetrics.metrics.filter(
      metric => metric.metricName === selectedCategory
    )
    return transformMetricsData(filteredMetrics)
  }, [selectedCategory])

  const transformedRealTimeMetrics = React.useMemo(() => {
    return mockFleetMetrics.realTimeMetrics
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your fleet's performance and operations
          </p>
        </div>
        <DownloadReports />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <DateRangePicker
          value={dateRange}
          onChange={(range) => setDateRange(range || { from: subDays(new Date(), 7), to: new Date() })}
        />
        <Select value={interval} onValueChange={(value: IntervalType) => setInterval(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">Hourly</SelectItem>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={(value: AnalyticsCategory) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select analytics category" />
          </SelectTrigger>
          <SelectContent>
            {analyticsCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Description Card */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-2">
            {analyticsCategories.find(c => c.value === selectedCategory)?.icon}
            <div>
              <h2 className="font-semibold">
                {analyticsCategories.find(c => c.value === selectedCategory)?.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {analyticsCategories.find(c => c.value === selectedCategory)?.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category-specific content */}
      {selectedCategory === 'fleet-utilization' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Active Vehicles"
              value="85%"
              description="+5% from last period"
              icon={<Car className="h-4 w-4" />}
            />
            <MetricCard
              title="Average Daily Usage"
              value="6.5 hrs"
              description="Per active vehicle"
              icon={<Clock className="h-4 w-4" />}
            />
            <MetricCard
              title="Fleet Efficiency"
              value="92%"
              description="Route optimization score"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              title="Idle Time"
              value="15%"
              description="-3% from last period"
              icon={<Timer className="h-4 w-4" />}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Efficiency Trends</CardTitle>
                <CardDescription>Actual vs target efficiency over time</CardDescription>
              </CardHeader>
              <CardContent>
                <FleetEfficiencyChart data={fleetEfficiencyData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Utilization</CardTitle>
                <CardDescription>Hourly utilization patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleUtilizationChart data={vehicleUtilizationData} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators over time</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsChart
                metrics={transformedMetrics}
                title="Fleet Performance"
                metricTypes={['utilization', 'efficiency', 'idle']}
                dimensions={['daily', 'weekly', 'monthly']}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === 'vehicle-status' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Total Fleet"
              value="90"
              description="Active vehicles"
              icon={<Car className="h-4 w-4" />}
            />
            <MetricCard
              title="Utilization Rate"
              value="78%"
              description="+5% from last month"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              title="Maintenance Rate"
              value="8.9%"
              description="Within target range"
              icon={<Tool className="h-4 w-4" />}
            />
            <MetricCard
              title="Availability"
              value="92%"
              description="Fleet readiness"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Status Distribution</CardTitle>
                <CardDescription>Real-time vehicle status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart data={vehicleStatusData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Status Trends</CardTitle>
                <CardDescription>Historical status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleStatusTrendChart data={vehicleStatusTrendData} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mockFleetMetrics.performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <p className="text-sm text-muted-foreground">{metric.value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-medium",
                        metric.trend === 'up' ? "text-green-600" : "text-red-600"
                      )}>
                        {metric.change}
                      </span>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === 'maintenance' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Completed Services"
              value="156"
              description="Last 30 days"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <MetricCard
              title="Pending Services"
              value="23"
              description="Scheduled"
              icon={<Clock className="h-4 w-4" />}
            />
            <MetricCard
              title="Average Cost"
              value="$450"
              description="Per service"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard
              title="Compliance Rate"
              value="98%"
              description="Service schedule adherence"
              icon={<Shield className="h-4 w-4" />}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>Scheduled vs unscheduled maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <MaintenanceHistoryChart data={maintenanceHistoryData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Costs</CardTitle>
                <CardDescription>Monthly maintenance expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <MaintenanceCostChart data={maintenanceCostData} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Service Types Overview</CardTitle>
              <CardDescription>Breakdown by service category</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceTypeChart data={mockFleetMetrics.maintenanceStats} />
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === 'battery' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Average Health"
              value="95%"
              description="-2% from last month"
              icon={<BatteryCharging className="h-4 w-4" />}
            />
            <MetricCard
              title="Charge Cycles"
              value="150"
              description="Average per vehicle"
              icon={<Battery className="h-4 w-4" />}
            />
            <MetricCard
              title="Low Battery"
              value="3"
              description="Vehicles need charging"
              icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
            />
            <MetricCard
              title="Battery Life"
              value="85%"
              description="Average remaining"
              icon={<Activity className="h-4 w-4" />}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Battery Health Trends</CardTitle>
                <CardDescription>Battery health and charge cycles over time</CardDescription>
              </CardHeader>
              <CardContent>
                <BatteryHealthChart data={batteryHealthData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Charging Patterns</CardTitle>
                <CardDescription>24-hour charging distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <BatteryChargingChart data={batteryChargingData} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact</CardTitle>
              <CardDescription>Sustainability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mockFleetMetrics.environmentalMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <p className="text-sm text-muted-foreground">Current: {metric.value}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Target: {metric.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === 'usage' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Peak Usage"
              value="90%"
              description="4PM - 6PM"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              title="Off-Peak"
              value="20%"
              description="12AM - 4AM"
              icon={<Activity className="h-4 w-4" />}
            />
            <MetricCard
              title="Average Usage"
              value="65%"
              description="Daily utilization"
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <MetricCard
              title="Utilization Score"
              value="8.5"
              description="Out of 10"
              icon={<Gauge className="h-4 w-4" />}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Daily Usage Pattern</CardTitle>
              <CardDescription>Vehicle utilization throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <UsagePatternChart data={usagePatternData} />
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === 'incidents' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Total Incidents"
              value="19"
              description="Last 30 days"
              icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
            />
            <MetricCard
              title="Average Severity"
              value="2.4"
              description="Scale of 1-5"
              icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
            />
            <MetricCard
              title="Response Time"
              value="15m"
              description="Average response"
              icon={<Clock className="h-4 w-4" />}
            />
            <MetricCard
              title="Resolution Rate"
              value="94%"
              description="Within 24 hours"
              icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
              <CardDescription>Number of incidents and severity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentChart data={incidentData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest reported safety events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidentData.map((incident, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-full",
                        incident.severity > 2.5 ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                      )}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Incident #{2024001 + index}</p>
                        <p className="text-sm text-muted-foreground">
                          Reported on {incident.month} 2024
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Severity: {incident.severity.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">
                        {incident.severity > 2.5 ? "High Priority" : "Medium Priority"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === 'location' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Location History</CardTitle>
              <CardDescription>Vehicle movement patterns and hotspots</CardDescription>
            </CardHeader>
            <CardContent>
              <LocationHistoryChart data={locationHistoryData} />
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCategory === 'iot' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Connected Devices"
              value="45"
              description="98% uptime"
              icon={<Wifi className="h-4 w-4" />}
            />
            <MetricCard
              title="Average Latency"
              value="150ms"
              description="+20ms from baseline"
              icon={<Activity className="h-4 w-4" />}
            />
            <MetricCard
              title="Signal Strength"
              value="85%"
              description="Good coverage"
              icon={<Signal className="h-4 w-4" />}
            />
            <MetricCard
              title="Data Transfer"
              value="2.5 TB"
              description="Last 24 hours"
              icon={<BarChart3 className="h-4 w-4" />}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Health Distribution</CardTitle>
                <CardDescription>Status of all connected devices</CardDescription>
              </CardHeader>
              <CardContent>
                <IoTHealthChart data={iotHealthData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
                <CardDescription>Latency and packet loss metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkPerformanceChart data={networkPerformanceData} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Transmission</CardTitle>
                <CardDescription>Data flow and processing metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <FunnelChart data={mockFleetMetrics.funnelSteps} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Signal strength by location</CardDescription>
              </CardHeader>
              <CardContent>
                <TopDimensionsChart data={mockFleetMetrics.topLocations} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedCategory === 'integrations' && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Active APIs"
              value="12"
              description="93% success rate"
              icon={<Network className="h-4 w-4" />}
            />
            <MetricCard
              title="Webhooks"
              value="8"
              description="98% delivery rate"
              icon={<Webhook className="h-4 w-4" />}
            />
            <MetricCard
              title="Database Connections"
              value="140"
              description="25ms avg latency"
              icon={<Database className="h-4 w-4" />}
            />
            <MetricCard
              title="Custom Services"
              value="4"
              description="99.8% uptime"
              icon={<Settings className="h-4 w-4" />}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
                <CardDescription>Request volume and error rates</CardDescription>
              </CardHeader>
              <CardContent>
                <APIMetricsChart data={integrationsData.apis} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Webhook Delivery</CardTitle>
                <CardDescription>Success and failure rates</CardDescription>
              </CardHeader>
              <CardContent>
                <WebhookPerformanceChart data={integrationsData.webhooks} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Database Metrics</CardTitle>
                <CardDescription>Connection pool and query performance</CardDescription>
              </CardHeader>
              <CardContent>
                <DatabaseMetricsChart data={integrationsData.databases} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom Services</CardTitle>
                <CardDescription>Status and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrationsData.custom.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.type}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-medium",
                          service.status === 'operational' ? "text-green-600" : 
                          service.status === 'training' ? "text-blue-600" : "text-yellow-600"
                        )}>
                          {service.status}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last sync: {service.lastSync}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>Current status of all integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <h3 className="font-semibold">APIs</h3>
                    <div className="grid gap-2">
                      {integrationsData.apis.map((api, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              api.status === 'active' ? "bg-green-500" : "bg-yellow-500"
                            )} />
                            <span className="font-medium">{api.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {api.latency}ms | {api.errors} errors
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-semibold">Webhooks</h3>
                    <div className="grid gap-2">
                      {integrationsData.webhooks.map((webhook, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              webhook.status === 'active' ? "bg-green-500" : "bg-red-500"
                            )} />
                            <span className="font-medium">{webhook.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Last triggered: {webhook.lastTriggered}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-semibold">Databases</h3>
                    <div className="grid gap-2">
                      {integrationsData.databases.map((db, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              db.status === 'healthy' ? "bg-green-500" : "bg-yellow-500"
                            )} />
                            <span className="font-medium">{db.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {db.connections} connections | {db.size}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component for metric cards
interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
