import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsOptions, DashboardProps } from '../types';
import { FleetOverview } from './FleetOverview';
import { VehicleUsageChart } from './VehicleUsageChart';
import { RevenueChart } from './RevenueChart';
import { DemandHeatmap } from './DemandHeatmap';
import { MaintenancePredictor } from './MaintenancePredictor';
import { RouteOptimization } from './RouteOptimization';
import { KPICards } from './KPICards';

/**
 * Analytics Dashboard Component
 * 
 * A comprehensive dashboard displaying various analytics data for fleet management
 */
export const Dashboard: React.FC<DashboardProps> = ({ 
  options: initialOptions,
  onFilterChange,
  onRefresh,
  fleetId,
  vehicleId,
  className = '',
  isLoading: externalLoading,
  error: externalError,
  showFilters = true,
  showExport = true,
  theme = 'light',
  customCharts = [],
}) => {
  // Default options if none provided
  const defaultOptions: AnalyticsOptions = {
    timeRange: 'week',
    granularity: 'daily',
    includePredictions: true,
    realtime: false,
    ...(fleetId ? { fleetIds: [fleetId] } : {}),
    ...(initialOptions || {}),
  };

  // State for filter panel
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Use the analytics hook
  const {
    data,
    isLoading: hookLoading,
    isError: hookIsError,
    error: hookError,
    options,
    updateOptions,
    resetOptions,
    refetch,
  } = useAnalytics({
    initialOptions: defaultOptions,
    fetchInterval: options?.realtime ? 30000 : 0, // 30 seconds if real-time is enabled
  });

  // Use external loading/error state if provided, otherwise use hook's state
  const isLoading = externalLoading !== undefined ? externalLoading : hookLoading;
  const isError = externalError !== undefined;
  const error = externalError || (hookIsError ? hookError : null);

  // Handler for filter changes
  const handleFilterChange = (newOptions: Partial<AnalyticsOptions>) => {
    updateOptions(newOptions);
    if (onFilterChange) {
      onFilterChange({ ...options, ...newOptions });
    }
  };

  // Handler for refresh
  const handleRefresh = () => {
    refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

  // Toggle filter panel
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className={`analytics-dashboard ${theme} ${className}`}>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Fleet Analytics Dashboard</h1>
        
        <div className="dashboard-controls">
          {showFilters && (
            <button 
              className="filter-button" 
              onClick={toggleFilters}
              aria-expanded={isFilterOpen}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          )}
          
          <button className="refresh-button" onClick={handleRefresh}>
            Refresh Data
          </button>
          
          {showExport && (
            <button className="export-button">
              Export
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && isFilterOpen && (
        <div className="filter-panel">
          <div className="filter-section">
            <h3>Time Range</h3>
            <select 
              value={options.timeRange} 
              onChange={(e) => handleFilterChange({ timeRange: e.target.value as any })}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {options.timeRange === 'custom' && (
              <div className="date-range">
                <label>
                  Start:
                  <input 
                    type="date" 
                    value={options.startDate} 
                    onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                  />
                </label>
                <label>
                  End:
                  <input 
                    type="date" 
                    value={options.endDate} 
                    onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="filter-section">
            <h3>Data Granularity</h3>
            <select 
              value={options.granularity} 
              onChange={(e) => handleFilterChange({ granularity: e.target.value as any })}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button onClick={resetOptions}>Reset Filters</button>
            <button onClick={toggleFilters}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      )}
      
      {isError && (
        <div className="error-state">
          <p>Error loading analytics data</p>
          <p>{error?.message}</p>
          <button onClick={handleRefresh}>Try Again</button>
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && !isError && data && (
        <div className="dashboard-content">
          {/* KPIs */}
          <section className="dashboard-section kpi-section">
            <KPICards kpis={data.kpis} />
          </section>
          
          {/* Fleet Overview */}
          <section className="dashboard-section">
            <h2>Fleet Overview</h2>
            <FleetOverview data={data.fleetOverview} />
          </section>
          
          {/* Usage and Revenue Charts */}
          <div className="dashboard-row">
            <section className="dashboard-section">
              <h2>Vehicle Usage</h2>
              <VehicleUsageChart 
                data={data.usageData} 
                includePredictions={options.includePredictions} 
              />
            </section>
            
            <section className="dashboard-section">
              <h2>Revenue Analysis</h2>
              <RevenueChart 
                data={data.revenueData} 
                includePredictions={options.includePredictions}
              />
            </section>
          </div>
          
          {/* Demand and Maintenance */}
          <div className="dashboard-row">
            <section className="dashboard-section">
              <h2>Demand Heatmap</h2>
              <DemandHeatmap />
            </section>
            
            <section className="dashboard-section">
              <h2>Maintenance Predictor</h2>
              <MaintenancePredictor />
            </section>
          </div>
          
          {/* Route Optimization */}
          <section className="dashboard-section">
            <h2>Route Optimization</h2>
            <RouteOptimization />
          </section>
          
          {/* Custom Charts */}
          {customCharts.length > 0 && (
            <section className="dashboard-section custom-charts">
              <h2>Custom Analytics</h2>
              <div className="custom-charts-container">
                {customCharts.map((chart, index) => (
                  <div key={`custom-chart-${index}`} className="custom-chart">
                    {chart}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};