"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DatabaseConfig, DatabaseStats, DatabaseHealthCheck } from '@/types/integration'
import { useDatabase } from '@/hooks/use-database'

interface DatabaseMonitorProps {
  config: DatabaseConfig
  refreshInterval?: number
}

interface DatabaseMetrics {
  active_connections: number
  db_version: string
  start_time: Date
}

interface TableStats {
  table_name: string
  row_count: number
  size_bytes: number
}

export function DatabaseMonitor({
  config,
  refreshInterval = 30000, // default 30 seconds
}: DatabaseMonitorProps) {
  const { executeQuery } = useDatabase()
  const [health, setHealth] = useState<DatabaseHealthCheck>({
    status: 'unhealthy',
    latency: 0,
  })
  const [stats, setStats] = useState<DatabaseStats>({
    connectionCount: 0,
    activeQueries: 0,
    slowQueries: 0,
    errorRate: 0,
    avgResponseTime: 0,
    tableStats: []
  })

  useEffect(() => {
    const fetchDatabaseMetrics = async () => {
      try {
        // Get health metrics
        const healthResult = await executeQuery(config, `
          SELECT 
            COUNT(*) as active_connections,
            version() as db_version,
            pg_postmaster_start_time() as start_time
          FROM pg_stat_activity
        `) as DatabaseMetrics[]

        if (healthResult && healthResult.length > 0) {
          const metrics = healthResult[0]
          setHealth({
            status: 'healthy',
            latency: 0,
            details: {
              connections: metrics.active_connections,
              uptime: Date.now() - new Date(metrics.start_time).getTime(),
              version: metrics.db_version,
            },
          })
        }

        // Get table statistics
        const tableStatsResult = await executeQuery(config, `
          SELECT 
            schemaname || '.' || relname as table_name,
            n_live_tup as row_count,
            pg_total_relation_size(relid) as size_bytes
          FROM pg_stat_user_tables
          ORDER BY n_live_tup DESC
          LIMIT 10
        `) as TableStats[]

        // Get performance metrics
        const perfMetrics = await executeQuery(config, `
          SELECT 
            COUNT(*) as active_queries,
            (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > '1 minute'::interval) as slow_queries,
            (SELECT COALESCE(EXTRACT(EPOCH FROM AVG(now() - query_start)), 0) FROM pg_stat_activity WHERE state = 'active') as avg_response_time
          FROM pg_stat_activity 
          WHERE state = 'active'
        `) as Array<{
          active_queries: number
          slow_queries: number
          avg_response_time: number
        }>

        if (tableStatsResult && perfMetrics && perfMetrics.length > 0) {
          const perf = perfMetrics[0]
          setStats({
            connectionCount: healthResult[0].active_connections,
            activeQueries: perf.active_queries,
            slowQueries: perf.slow_queries,
            errorRate: 0, // This would need a custom error tracking solution
            avgResponseTime: perf.avg_response_time,
            tableStats: tableStatsResult.map(table => ({
              name: table.table_name,
              rowCount: table.row_count,
              sizeBytes: table.size_bytes,
              lastUpdated: new Date().toISOString()
            }))
          })
        }
      } catch (error) {
        console.error('Failed to fetch database metrics:', error)
        setHealth({
          status: 'unhealthy',
          latency: 0,
          message: error instanceof Error ? error.message : 'Failed to fetch metrics'
        })
      }
    }

    fetchDatabaseMetrics()
    const interval = setInterval(fetchDatabaseMetrics, refreshInterval)

    return () => clearInterval(interval)
  }, [config, refreshInterval, executeQuery])

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Database Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className={health.status === 'healthy' ? 'text-green-500' : 'text-red-500'}>
                {health.status}
              </span>
            </div>
            {health.details && (
              <>
                <div className="flex items-center justify-between">
                  <span>Active Connections</span>
                  <span>{health.details.connections}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <span>{Math.floor(health.details.uptime / (1000 * 60 * 60))} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Version</span>
                  <span>{health.details.version}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.tableStats.map((table, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{table.name}</span>
                  <span>{table.rowCount.toLocaleString()} rows</span>
                </div>
                <Progress
                  value={
                    (table.sizeBytes /
                      Math.max(...stats.tableStats.map((t) => t.sizeBytes))) *
                    100
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 