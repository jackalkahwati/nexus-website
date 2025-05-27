import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { 
  AnalyticsOptions, 
  FleetOverviewData, 
  UsageData, 
  RevenueData, 
  KPI,
  TimeSeriesPoint
} from '../types';

interface UseAnalyticsProps {
  baseUrl?: string;
  apiKey?: string;
  initialOptions?: AnalyticsOptions;
  onError?: (error: Error) => void;
  fetchInterval?: number; // in milliseconds, for real-time updates
}

interface AnalyticsData {
  fleetOverview: FleetOverviewData;
  usageData: UsageData[];
  revenueData: RevenueData[];
  kpis: KPI[];
  utilizationTimeSeries: TimeSeriesPoint[];
}

/**
 * Hook for fetching analytics data with filtering and real-time updates
 */
export function useAnalytics({
  baseUrl = '/api/analytics',
  apiKey,
  initialOptions,
  onError,
  fetchInterval = 0, // 0 means no auto-refresh
}: UseAnalyticsProps = {}) {
  const [options, setOptions] = useState<AnalyticsOptions>(initialOptions || {
    timeRange: 'week',
    granularity: 'daily',
    includePredictions: true,
    realtime: false,
  });

  // Create a query key that includes all options to trigger refetches when options change
  const queryKey = ['analytics', options];

  // Define async function to fetch analytics data
  const fetchAnalytics = useCallback(async (): Promise<AnalyticsData> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all options to query params
      if (options.timeRange) queryParams.append('timeRange', options.timeRange);
      if (options.startDate) queryParams.append('startDate', options.startDate);
      if (options.endDate) queryParams.append('endDate', options.endDate);
      if (options.granularity) queryParams.append('granularity', options.granularity);
      if (options.includePredictions) queryParams.append('includePredictions', String(options.includePredictions));
      if (options.compareWithPreviousPeriod) queryParams.append('compareWithPrevious', String(options.compareWithPreviousPeriod));
      if (options.realtime) queryParams.append('realtime', String(options.realtime));
      
      // Add array filters
      options.vehicleTypes?.forEach(type => queryParams.append('vehicleType', type));
      options.regions?.forEach(region => queryParams.append('region', region));
      options.fleetIds?.forEach(fleetId => queryParams.append('fleetId', fleetId));
      options.userSegments?.forEach(segment => queryParams.append('userSegment', segment));
      
      // Make the API request
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }
      
      const url = `${baseUrl}?${queryParams.toString()}`;
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as AnalyticsData;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    }
  }, [baseUrl, apiKey, options, onError]);

  // Use react-query for data fetching, caching, and background updates
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<AnalyticsData, Error>(
    queryKey,
    fetchAnalytics,
    {
      refetchInterval: options.realtime ? fetchInterval : false,
      refetchOnWindowFocus: true,
      staleTime: 60000, // 1 minute
      onError: (err) => {
        if (onError) onError(err);
      },
    }
  );

  // Function to update filter options
  const updateOptions = useCallback((newOptions: Partial<AnalyticsOptions>) => {
    setOptions(prev => ({
      ...prev,
      ...newOptions,
    }));
  }, []);

  // Reset to default options
  const resetOptions = useCallback(() => {
    setOptions({
      timeRange: 'week',
      granularity: 'daily',
      includePredictions: true,
      realtime: false,
    });
  }, []);

  return {
    data,
    isLoading,
    isError,
    error,
    options,
    updateOptions,
    resetOptions,
    refetch,
  };
}