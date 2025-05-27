/* global React */

interface ChartProps {
  children?: React.ReactNode;
  data?: any[];
  dataKey?: string;
  onClick?: (data: any) => void;
  className?: string;
  [key: string]: any;
}

const mockRecharts = {
  ResponsiveContainer: ({ children, className }: ChartProps) => (
    <div data-testid="responsive-container" className={className || 'w-full h-full'}>
      {children}
    </div>
  ),

  LineChart: ({ children, data }: ChartProps) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),

  FunnelChart: ({ children }: ChartProps) => (
    <div data-testid="funnel-chart-container">
      {children}
    </div>
  ),

  Funnel: ({ children, data, dataKey, onClick }: ChartProps) => (
    <div 
      data-testid="funnel-chart" 
      data-chart-data={JSON.stringify(data)}
      data-key={dataKey}
      onClick={onClick}
    >
      {children}
    </div>
  ),

  Line: ({ dataKey, stroke }: { dataKey: string; stroke?: string }) => (
    <div 
      data-testid={`line-${dataKey}`}
      data-key={dataKey}
      style={{ stroke }}
    />
  ),

  XAxis: ({ dataKey, tickFormatter }: { dataKey: string; tickFormatter?: (value: any) => string }) => (
    <div 
      data-testid="x-axis"
      data-key={dataKey}
      data-formatter={tickFormatter?.toString()}
    />
  ),

  YAxis: () => <div data-testid="y-axis" />,

  CartesianGrid: ({ strokeDasharray }: { strokeDasharray?: string }) => (
    <div 
      data-testid="cartesian-grid"
      data-dash={strokeDasharray}
    />
  ),

  Tooltip: ({ formatter }: { formatter?: (value: any) => React.ReactNode }) => (
    <div 
      data-testid="tooltip"
      data-formatter={formatter?.toString()}
    />
  ),

  Legend: () => <div data-testid="legend" />,

  LabelList: ({ position, dataKey, content }: { position?: string; dataKey?: string; content?: React.ComponentType<any> }) => (
    <div 
      data-testid="label-list"
      data-position={position}
      data-key={dataKey}
    >
      {content && React.createElement(content)}
    </div>
  )
}

// Add displayNames
Object.entries(mockRecharts).forEach(([key, Component]) => {
  Component.displayName = `Recharts.${key}`
})

module.exports = mockRecharts
