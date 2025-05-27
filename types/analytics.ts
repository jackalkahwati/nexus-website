import React from 'react';

export interface FunnelData {
  name: string
  steps: FunnelStep[]
  startDate: string
  endDate: string
}

export interface MetricData {
  timestamp: number
  value: number
  dimensions?: Record<string, any>
}

export interface MetricsChartProps {
  title: string
  metrics: MetricData[]
  loading?: boolean
  error?: string
  onRetry?: () => void
  onTimeRangeChange?: (range: string) => void
  onMetricTypeChange?: (type: string) => void
  metricTypes?: string[]
  dimensions?: string[]
  onDimensionChange?: (dimension: string) => void
}

export interface FunnelStep {
  name: string
  count: number
  conversionRate?: number
}

export interface AnalyticsMetric {
  name: string
  value: number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
}

export interface TopDimension {
  dimension: string
  value: number
}

export interface AnalyticsTimeRange {
  startDate: Date
  endDate: Date
  interval: 'hour' | 'day' | 'week' | 'month'
  metrics?: string[] // Optional array of metric names to filter by
}

export interface MetricsOptions {
  startDate?: Date
  endDate?: Date
  interval?: string
  metrics?: string[]
}

export interface AnalyticsQueryParams extends MetricsOptions {
  userId?: string
  type?: 'metrics' | 'realtime' | 'dimensions' | 'funnel'
  dimension?: string
  limit?: number
  steps?: string[]
}

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
}

export interface DimensionData {
  value: string;
  count: number;
  percentage?: number;
}

export interface TopDimensionsChartProps {
  title?: string;
  data: DimensionData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  dimension: string;
  availableDimensions?: string[];
  onDimensionChange?: (dimension: string) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  showPercentages?: boolean;
  style?: React.CSSProperties;
}
