export type IntegrationType = 'api' | 'webhook' | 'sdk' | 'database' | 'custom'
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending'
export type IntegrationCategory = 
  | 'maintenance' 
  | 'payment' 
  | 'analytics' 
  | 'tracking' 
  | 'mapping'
  | 'notification'
  | 'authentication'
  | 'weather'
  | 'telematics'
  | 'fleet_management'

export interface Integration {
  id: string
  name: string
  description: string
  type: IntegrationType
  category: IntegrationCategory
  status: IntegrationStatus
  config: Record<string, any>
  credentials?: {
    apiKey?: string
    clientId?: string
    clientSecret?: string
    accessToken?: string
    refreshToken?: string
    endpoint?: string
  }
  metadata: {
    version: string
    lastSync?: string
    nextSync?: string
    errorCount: number
    successCount: number
  }
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface IntegrationLog {
  id: string
  integrationId: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  details?: any
  timestamp: string
}

export interface WebhookConfig {
  url: string
  events: string[]
  headers?: Record<string, string>
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  retryCount: number
  timeout: number
  active: boolean
}

export interface DatabaseConfig {
  type: 'mysql' | 'postgresql' | 'mongodb' | 'redis'
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl: boolean
  options?: {
    connectionLimit?: number
    connectTimeout?: number
    acquireTimeout?: number
    waitForConnections?: boolean
    queueLimit?: number
    charset?: string
    timezone?: string
    maxPoolSize?: number
    minPoolSize?: number
    idleTimeoutMillis?: number
    replicaSet?: string
    readPreference?: 'primary' | 'secondary' | 'nearest'
    ssl?: {
      rejectUnauthorized?: boolean
      ca?: string
      key?: string
      cert?: string
    }
  }
}

export interface ApiConfig {
  baseUrl: string
  version: string
  authentication: {
    type: 'apiKey' | 'oauth2' | 'basic' | 'bearer'
    credentials: Record<string, string>
  }
  endpoints: {
    [key: string]: {
      path: string
      method: string
      parameters?: Record<string, any>
      headers?: Record<string, string>
    }
  }
  rateLimit?: {
    requests: number
    period: number // in seconds
  }
}

export interface SdkConfig {
  language: string
  version: string
  dependencies: Record<string, string>
  initialization: Record<string, any>
  options?: Record<string, any>
}

export interface IntegrationStats {
  totalIntegrations: number
  activeIntegrations: number
  failedIntegrations: number
  dataProcessed: number
  averageResponseTime: number
  uptime: number
  lastUpdated: string
}

export interface DatabaseStats {
  connectionCount: number
  activeQueries: number
  slowQueries: number
  errorRate: number
  avgResponseTime: number
  tableStats: {
    name: string
    rowCount: number
    sizeBytes: number
    lastUpdated: string
  }[]
  replicationLag?: number
  cacheHitRatio?: number
}

export interface DatabaseQueryResult {
  success: boolean
  data?: any[]
  error?: string
  duration: number
  rowCount?: number
  fields?: {
    name: string
    type: string
  }[]
}

export interface DatabaseHealthCheck {
  status: 'healthy' | 'unhealthy'
  latency: number
  message?: string
  details?: {
    connections: number
    uptime: number
    version: string
    replication?: {
      role: 'primary' | 'replica'
      lag: number
    }
  }
}

export interface DatabaseInfo {
  type: string
  host: string
  database: string
  tables: { table_name: string }[]
}

export interface QueryField {
  name: string
  type: string
} 