# Analytics Components Testing Documentation

## Overview

This document outlines the testing strategy and implementation for the analytics components in our application.

## Components Under Test

### 1. MetricsChart
- Displays time-series metrics data
- Handles multiple metric types
- Supports time range selection
- Provides loading and error states

### 2. FunnelChart
- Visualizes conversion funnel data
- Shows conversion rates between stages
- Supports date range filtering
- Handles custom styling

### 3. TopDimensionsChart
- Shows top values for different dimensions
- Supports dimension switching
- Handles limit selection
- Provides percentage view

## Test Types

### Unit Tests

1. **Component Rendering**
   - Basic rendering with props
   - Loading states
   - Error states
   - Empty states

2. **User Interactions**
   - Time/date range selection
   - Dimension switching
   - Limit changes
   - Retry actions

3. **Data Updates**
   - New data rendering
   - Data sorting
   - Percentage calculations
   - Tooltip formatting

### Integration Tests

1. **Data Flow**
   - API data integration
   - Real-time updates
   - Error handling
   - Cache integration

2. **Component Interactions**
   - Filter synchronization
   - Chart updates
   - State management

### E2E Tests

1. **User Flows**
   - Dashboard navigation
   - Filter application
   - Data exploration
   - Export functionality

## Test Setup

### Mock Data

```typescript
// Metric Data
const mockMetricData = [
  {
    timestamp: new Date('2024-01-01T00:00:00Z'),
    value: 100,
    metricName: 'pageViews',
    dimensions: { page: '/home' },
  },
  // ...
];

// Funnel Data
const mockFunnelData = [
  {
    name: 'Page View',
    value: 1000,
    fill: '#4F46E5',
  },
  // ...
];

// Dimension Data
const mockDimensionData = [
  {
    dimension: 'browser',
    value: 'Chrome',
    count: 5000,
    percentage: 50,
  },
  // ...
];
```

### Test Utilities

```typescript
// Chart Testing Utilities
const renderChart = (props) => {
  render(
    <TestWrapper>
      <ChartComponent {...props} />
    </TestWrapper>
  );
};

// Mock Handlers
const mockHandlers = [
  http.get('/api/analytics/metrics', () => {
    return HttpResponse.json(mockMetricData);
  }),
  // ...
];
```

## Test Cases

### MetricsChart

1. Basic Rendering
   ```typescript
   it('renders chart with metrics data', () => {
     render(<MetricsChart metrics={mockMetrics} title="Page Views" />);
     expect(screen.getByText('Page Views')).toBeInTheDocument();
   });
   ```

2. Interaction Handling
   ```typescript
   it('handles time range selection', async () => {
     const onTimeRangeChange = jest.fn();
     render(
       <MetricsChart
         metrics={mockMetrics}
         onTimeRangeChange={onTimeRangeChange}
       />
     );
     await userEvent.selectOptions(
       screen.getByRole('combobox'),
       '7d'
     );
     expect(onTimeRangeChange).toHaveBeenCalledWith('7d');
   });
   ```

### FunnelChart

1. Conversion Rates
   ```typescript
   it('displays conversion rates between stages', () => {
     render(
       <FunnelChart
         data={mockFunnelData}
         showConversionRates
       />
     );
     expect(screen.getByText('50%')).toBeInTheDocument();
   });
   ```

2. Data Updates
   ```typescript
   it('updates chart when new data is provided', async () => {
     const { rerender } = render(
       <FunnelChart data={mockFunnelData} />
     );
     rerender(<FunnelChart data={newData} />);
     await waitFor(() => {
       expect(screen.getAllByTestId('funnel-stage'))
         .toHaveLength(4);
     });
   });
   ```

### TopDimensionsChart

1. Dimension Filtering
   ```typescript
   it('handles dimension selection change', async () => {
     const onDimensionChange = jest.fn();
     render(
       <TopDimensionsChart
         data={mockDimensionData}
         onDimensionChange={onDimensionChange}
       />
     );
     await userEvent.selectOptions(
       screen.getByRole('combobox'),
       'os'
     );
     expect(onDimensionChange).toHaveBeenCalledWith('os');
   });
   ```

2. Sorting
   ```typescript
   it('sorts data in descending order by default', () => {
     render(
       <TopDimensionsChart
         data={mockDimensionData}
       />
     );
     const values = screen.getAllByTestId('dimension-bar')
       .map(bar => parseInt(bar.getAttribute('data-value')));
     expect(values).toEqual([5000, 3000, 2000]);
   });
   ```

## Best Practices

1. **Component Testing**
   - Test all states (loading, error, empty)
   - Verify user interactions
   - Check data updates
   - Test edge cases

2. **Mock Management**
   - Keep mocks simple and focused
   - Use realistic data structures
   - Update mocks with schema changes

3. **Test Organization**
   - Group related tests
   - Use descriptive names
   - Follow AAA pattern

4. **Performance**
   - Mock heavy computations
   - Avoid unnecessary rerenders
   - Clean up after tests

## Common Issues

1. **Chart Testing**
   - Mock chart libraries
   - Handle async updates
   - Test responsive behavior

2. **Data Handling**
   - Type consistency
   - Date formatting
   - Number formatting

3. **State Management**
   - Component updates
   - Filter synchronization
   - Cache invalidation

## Running Tests

```bash
# Run all analytics tests
npm test components/analytics

# Run specific component tests
npm test MetricsChart
npm test FunnelChart
npm test TopDimensionsChart

# Run with coverage
npm test:coverage components/analytics
```

## Adding New Tests

1. Create test file in `__tests__` directory
2. Import necessary utilities
3. Define mock data
4. Write test cases
5. Run tests and verify coverage
6. Update documentation
``` 