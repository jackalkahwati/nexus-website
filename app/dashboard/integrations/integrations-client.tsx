"use client"

import { Suspense, lazy, useState } from 'react'
import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Network, Webhook, Database, Settings, Link2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Lazy load heavy components
const LineChart = lazy(() => import('recharts').then(mod => ({ default: mod.LineChart as any })))
const Line = lazy(() => import('recharts').then(mod => ({ default: mod.Line as any })))
const AreaChart = lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart as any })))
const Area = lazy(() => import('recharts').then(mod => ({ default: mod.Area as any })))
const BarChart = lazy(() => import('recharts').then(mod => ({ default: mod.BarChart as any })))
const Bar = lazy(() => import('recharts').then(mod => ({ default: mod.Bar as any })))
const ComposedChart = lazy(() => import('recharts').then(mod => ({ default: mod.ComposedChart as any })))
const XAxis = lazy(() => import('recharts').then(mod => ({ default: mod.XAxis as any })))
const YAxis = lazy(() => import('recharts').then(mod => ({ default: mod.YAxis as any })))
const CartesianGrid = lazy(() => import('recharts').then(mod => ({ default: mod.CartesianGrid as any })))
const Tooltip = lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip as any })))
const Legend = lazy(() => import('recharts').then(mod => ({ default: mod.Legend as any })))
const ResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer as any })))

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

function LoadingSpinner() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

function APIMetricsChart({ data }: { data: typeof integrationsData.apis }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  )
}

function WebhookPerformanceChart({ data }: { data: typeof integrationsData.webhooks }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  )
}

function DatabaseMetricsChart({ data }: { data: typeof integrationsData.databases }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  )
}

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

function AddIntegrationDialog() {
  const [integrationType, setIntegrationType] = useState("")
  const [presetType, setPresetType] = useState("")
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
          <DialogDescription>
            Configure a new integration with your external services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="integration-type">Integration Type</Label>
            <Select onValueChange={setIntegrationType}>
              <SelectTrigger id="integration-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="erp">ERP System</SelectItem>
                <SelectItem value="crm">CRM System</SelectItem>
                <SelectItem value="accounting">Accounting System</SelectItem>
                <SelectItem value="hr">HR System</SelectItem>
                <SelectItem value="scm">Supply Chain Management</SelectItem>
                <SelectItem value="api">Custom API</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="custom">Custom Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {integrationType === 'erp' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="erp-system">ERP System</Label>
                <Select onValueChange={setPresetType}>
                  <SelectTrigger id="erp-system">
                    <SelectValue placeholder="Select ERP system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sap">SAP ERP</SelectItem>
                    <SelectItem value="oracle">Oracle ERP Cloud</SelectItem>
                    <SelectItem value="dynamics">Microsoft Dynamics 365</SelectItem>
                    <SelectItem value="netsuite">NetSuite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instance-url">Instance URL</Label>
                <Input id="instance-url" placeholder="https://your-erp-instance.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input id="client-id" placeholder="Enter client ID" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input id="client-secret" type="password" placeholder="Enter client secret" />
              </div>
            </>
          )}

          {integrationType === 'crm' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="crm-system">CRM System</Label>
                <Select onValueChange={setPresetType}>
                  <SelectTrigger id="crm-system">
                    <SelectValue placeholder="Select CRM system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="dynamics-crm">Microsoft Dynamics CRM</SelectItem>
                    <SelectItem value="zoho">Zoho CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-domain">Organization Domain</Label>
                <Input id="org-domain" placeholder="your-org.salesforce.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter API key" />
              </div>
            </>
          )}

          {integrationType === 'accounting' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="accounting-system">Accounting System</Label>
                <Select onValueChange={setPresetType}>
                  <SelectTrigger id="accounting-system">
                    <SelectValue placeholder="Select accounting system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quickbooks">QuickBooks</SelectItem>
                    <SelectItem value="xero">Xero</SelectItem>
                    <SelectItem value="sage">Sage</SelectItem>
                    <SelectItem value="freshbooks">FreshBooks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-id">Company ID</Label>
                <Input id="company-id" placeholder="Enter company ID" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="access-token">Access Token</Label>
                <Input id="access-token" type="password" placeholder="Enter access token" />
              </div>
            </>
          )}

          {integrationType === 'hr' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="hr-system">HR System</Label>
                <Select onValueChange={setPresetType}>
                  <SelectTrigger id="hr-system">
                    <SelectValue placeholder="Select HR system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workday">Workday</SelectItem>
                    <SelectItem value="bamboo">BambooHR</SelectItem>
                    <SelectItem value="adp">ADP</SelectItem>
                    <SelectItem value="namely">Namely</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input id="subdomain" placeholder="your-company.workday.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api-token">API Token</Label>
                <Input id="api-token" type="password" placeholder="Enter API token" />
              </div>
            </>
          )}

          {integrationType === 'scm' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="scm-system">Supply Chain System</Label>
                <Select onValueChange={setPresetType}>
                  <SelectTrigger id="scm-system">
                    <SelectValue placeholder="Select SCM system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sap-scm">SAP SCM</SelectItem>
                    <SelectItem value="oracle-scm">Oracle SCM Cloud</SelectItem>
                    <SelectItem value="manhattan">Manhattan Associates</SelectItem>
                    <SelectItem value="blue-yonder">Blue Yonder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instance-url">Instance URL</Label>
                <Input id="instance-url" placeholder="https://your-scm-instance.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter API key" />
              </div>
            </>
          )}

          {integrationType === 'api' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter API key" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input id="api-endpoint" placeholder="https://api.example.com" />
              </div>
            </>
          )}
          {integrationType === 'webhook' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-webhook-endpoint.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secret-key">Secret Key</Label>
                <Input id="secret-key" type="password" placeholder="Enter webhook secret" />
              </div>
            </>
          )}
          {integrationType === 'database' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="connection-string">Connection String</Label>
                <Input id="connection-string" type="password" placeholder="Enter connection string" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="database-type">Database Type</Label>
                <Select>
                  <SelectTrigger id="database-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="redis">Redis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {integrationType === 'custom' && (
            <div className="grid gap-2">
              <Label htmlFor="configuration">Configuration JSON</Label>
              <Input id="configuration" placeholder="Enter configuration" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">Add Integration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function IntegrationsClient() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Monitor and manage all your external service connections
          </p>
        </div>
        <AddIntegrationDialog />
      </div>

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
      </div>
    </div>
  )
} 