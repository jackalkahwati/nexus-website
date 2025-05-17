import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { Alert, AlertDescription } from '../ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface SecurityMetrics {
  totalUsage: number
  successfulUses: number
  failedAttempts: number
  generationEvents: number
  recentActivity: Array<{
    action: string
    status: string
    createdAt: Date
    details: any
  }>
}

export function RecoveryCodesMonitor() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/monitoring/security-metrics')
        if (!response.ok) throw new Error('Failed to fetch metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics')
      } finally {
        setLoading(false)
      }
    }

    const interval = setInterval(fetchMetrics, 60000) // Refresh every minute
    fetchMetrics()
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading security metrics...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!metrics) {
    return null
  }

  const successRate = metrics.totalUsage > 0
    ? (metrics.successfulUses / metrics.totalUsage) * 100
    : 0

  const hasHighFailureRate = metrics.totalUsage > 10 && successRate < 70

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recovery Codes Usage Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Success Rate</p>
            <Progress value={successRate} className="w-full" />
            <p className="text-sm mt-1">{successRate.toFixed(1)}%</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Usage Statistics</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-sm">Total Uses</p>
                <p className="text-2xl font-bold">{metrics.totalUsage}</p>
              </div>
              <div>
                <p className="text-sm">Generation Events</p>
                <p className="text-2xl font-bold">{metrics.generationEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {hasHighFailureRate && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              High failure rate detected. Please review security logs and consider user training.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h4 className="text-sm font-semibold mb-2">Recent Activity</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.recentActivity.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.status}</TableCell>
                  <TableCell>
                    {new Date(activity.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
