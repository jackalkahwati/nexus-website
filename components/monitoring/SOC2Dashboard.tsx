"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Progress } from '../ui/progress'
import { Table } from '../ui/table'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'

interface SecurityMetrics {
  failedLoginAttempts: {
    last24Hours: number
    last7Days: number
    activelyLockedAccounts: number
  }
  mfaAdoption: {
    totalUsers: number
    mfaEnabledUsers: number
    adoptionRate: number
  }
  passwordPolicy: {
    compliantUsers: number
    nonCompliantUsers: number
    complianceRate: number
  }
  sessions: {
    activeSessions: number
    mfaVerifiedSessions: number
    averageSessionDuration: number
  }
  securityEvents: {
    total: number
    byType: Record<string, number>
    severity: {
      high: number
      medium: number
      low: number
    }
  }
  recoveryCodes: {
    totalGenerated: number
    totalUsed: number
    activeUsers: number
    usageRate: number
    suspiciousAttempts: number
    lastUsed: string
  }
}

interface ComplianceMetrics {
  overallStatus: 'compliant' | 'non-compliant' | 'warning'
  lastUpdated: string
  complianceRate: number
  checks: Array<{
    id: string
    name: string
    category: string
    status: 'compliant' | 'non-compliant' | 'warning'
    description: string
    details: Record<string, any>
    remediation?: string
  }>
  summary: {
    total: number
    compliant: number
    nonCompliant: number
    warning: number
  }
}

interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failure'
  errorMessage?: string
  timestamp: string
}

export function SOC2Dashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [compliance, setCompliance] = useState<ComplianceMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, metricsRes, complianceRes] = await Promise.all([
          fetch('/api/monitoring/audit-logs'),
          fetch('/api/monitoring/security-metrics'),
          fetch('/api/monitoring/compliance')
        ])

        const [logs, metrics, complianceData] = await Promise.all([
          logsRes.json(),
          metricsRes.json(),
          complianceRes.json()
        ])

        setAuditLogs(logs)
        setSecurityMetrics(metrics)
        setCompliance(complianceData)
      } catch (error) {
        console.error('Error fetching monitoring data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'compliant':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
      case 'failure':
      case 'non-compliant':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading || !securityMetrics || !compliance) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">SOC 2 Compliance Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
              <h3 className="font-semibold">Security Overview</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between">
                    <span>MFA Adoption</span>
                    <span>{securityMetrics.mfaAdoption.adoptionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={securityMetrics.mfaAdoption.adoptionRate} />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>Password Compliance</span>
                    <span>{securityMetrics.passwordPolicy.complianceRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={securityMetrics.passwordPolicy.complianceRate} />
                </div>
                <Alert>
                  <AlertTitle>Active Sessions</AlertTitle>
                  <AlertDescription>
                    {securityMetrics.sessions.activeSessions} total
                    ({securityMetrics.sessions.mfaVerifiedSessions} MFA verified)
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTitle>Recovery Codes</AlertTitle>
                  <AlertDescription>
                    <div>Active Users: {securityMetrics.recoveryCodes.activeUsers}</div>
                    <div>Usage Rate: {securityMetrics.recoveryCodes.usageRate.toFixed(1)}%</div>
                    {securityMetrics.recoveryCodes.suspiciousAttempts > 0 && (
                      <div className="text-red-500">
                        Suspicious Attempts: {securityMetrics.recoveryCodes.suspiciousAttempts}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold">Compliance Status</h3>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span>Overall Status</span>
                  <Badge className={getStatusColor(compliance.overallStatus)}>
                    {compliance.overallStatus}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span>Compliance Rate</span>
                    <span>{compliance.complianceRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={compliance.complianceRate} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliant</span>
                    <span>{compliance.summary.compliant}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Warning</span>
                    <span>{compliance.summary.warning}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Non-Compliant</span>
                    <span>{compliance.summary.nonCompliant}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold">Security Events</h3>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {securityMetrics.securityEvents.severity.high}
                    </div>
                    <div className="text-sm">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {securityMetrics.securityEvents.severity.medium}
                    </div>
                    <div className="text-sm">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {securityMetrics.securityEvents.severity.low}
                    </div>
                    <div className="text-sm">Low</div>
                  </div>
                </div>
                <Alert>
                  <AlertTitle>Failed Logins</AlertTitle>
                  <AlertDescription>
                    <div>Last 24h: {securityMetrics.failedLoginAttempts.last24Hours}</div>
                    <div>Last 7d: {securityMetrics.failedLoginAttempts.last7Days}</div>
                    <div>Locked accounts: {securityMetrics.failedLoginAttempts.activelyLockedAccounts}</div>
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-semibold">Authentication</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">MFA Status</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span>{securityMetrics.mfaAdoption.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MFA Enabled</span>
                      <span>{securityMetrics.mfaAdoption.mfaEnabledUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adoption Rate</span>
                      <span>{securityMetrics.mfaAdoption.adoptionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Password Policy</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Compliant Users</span>
                      <span>{securityMetrics.passwordPolicy.compliantUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Non-Compliant</span>
                      <span>{securityMetrics.passwordPolicy.nonCompliantUsers}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Recovery Codes</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Total Generated</span>
                      <span>{securityMetrics.recoveryCodes.totalGenerated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Used</span>
                      <span>{securityMetrics.recoveryCodes.totalUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span>{securityMetrics.recoveryCodes.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage Rate</span>
                      <span>{securityMetrics.recoveryCodes.usageRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Used</span>
                      <span>{format(new Date(securityMetrics.recoveryCodes.lastUsed), 'PPpp')}</span>
                    </div>
                    {securityMetrics.recoveryCodes.suspiciousAttempts > 0 && (
                      <Alert className="mt-2">
                        <AlertTitle>Security Alert</AlertTitle>
                        <AlertDescription>
                          {securityMetrics.recoveryCodes.suspiciousAttempts} suspicious recovery code attempts detected
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold">Session Management</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Active Sessions</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Total Active</span>
                      <span>{securityMetrics.sessions.activeSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MFA Verified</span>
                      <span>{securityMetrics.sessions.mfaVerifiedSessions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Failed Logins</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Last 24 Hours</span>
                      <span>{securityMetrics.failedLoginAttempts.last24Hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last 7 Days</span>
                      <span>{securityMetrics.failedLoginAttempts.last7Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Locked Accounts</span>
                      <span>{securityMetrics.failedLoginAttempts.activelyLockedAccounts}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-4">
            {compliance.checks.map(check => (
              <Card key={check.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{check.name}</h3>
                    <p className="text-sm text-gray-500">{check.description}</p>
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
                {check.remediation && (
                  <Alert className="mt-4">
                    <AlertTitle>Remediation Required</AlertTitle>
                    <AlertDescription>{check.remediation}</AlertDescription>
                  </Alert>
                )}
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Details</h4>
                  <pre className="mt-2 rounded bg-gray-100 p-2 text-sm">
                    {JSON.stringify(check.details, null, 2)}
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit-logs">
          <Card className="p-4">
            <Table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>Resource</th>
                  <th>User</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{format(new Date(log.timestamp), 'PPpp')}</td>
                    <td>{log.action}</td>
                    <td>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </td>
                    <td>{log.resource}</td>
                    <td>{log.userId || 'System'}</td>
                    <td>
                      <pre className="max-w-xs overflow-hidden text-xs">
                        {JSON.stringify(log.details)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
