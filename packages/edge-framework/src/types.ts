/**
 * Network connection status
 */
export type NetworkStatus = 'online' | 'offline' | 'limited';

/**
 * Network connection details
 */
export interface NetworkInfo {
  status: NetworkStatus;
  type?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  downlinkSpeed?: number; // in Mbps
  rtt?: number; // Round-trip time in ms
  effectiveBandwidth?: number; // in Mbps
  lastChecked: number; // timestamp
}

/**
 * Device capability information
 */
export interface DeviceCapabilities {
  storageQuota?: {
    total: number;
    used: number;
    available: number;
  };
  batteryStatus?: {
    level: number;
    charging: boolean;
    chargingTime?: number;
    dischargingTime?: number;
  };
  memoryStatus?: {
    totalJSHeapSize?: number;
    usedJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  };
  hardwareConcurrency: number;
  deviceMemory?: number; // in GB
  serviceWorkerSupported: boolean;
  indexedDBSupported: boolean;
  cachingAPISupported: boolean;
  networkInformationAPISupported: boolean;
  webPushSupported: boolean;
  geolocationSupported: boolean;
  backgroundSyncSupported: boolean;
  persistentStorageSupported: boolean;
}

/**
 * Edge configuration options
 */
export interface EdgeConfig {
  appName: string;
  storeVersion: string;
  syncInterval: number; // in milliseconds
  maxRetries: number;
  maxQueueSize: number;
  priorityLevels: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'none';
  heartbeatInterval: number; // in milliseconds
  cacheStrategy: 'network-first' | 'cache-first' | 'stale-while-revalidate';
  offlineMode: 'aggressive' | 'conservative' | 'manual';
  storageQuotaWarningThreshold: number; // percentage (0-1)
  serviceWorkerPath: string;
  enableMetrics: boolean;
  apiEndpoint: string;
  syncEndpoint: string;
  realtimeEndpoint?: string;
  enableEncryption: boolean;
  compressionThreshold: number; // in bytes, files larger than this will be compressed
  conflictResolutionStrategy: 'client-wins' | 'server-wins' | 'timestamp' | 'manual';
  apiRetryStrategy: 'exponential' | 'linear' | 'fixed';
  maxConcurrentRequests: number;
  useLocalStorage: boolean;
  useIndexedDB: boolean;
  customHeaders?: Record<string, string>;
}

/**
 * Record change type for sync operations
 */
export type ChangeType = 'create' | 'update' | 'delete';

/**
 * Sync record to track changes that need to be synchronized
 */
export interface SyncRecord<T = any> {
  id: string;
  entityType: string;
  entityId: string;
  changeType: ChangeType;
  data?: T;
  timestamp: number;
  deviceId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  priority: number;
  lastAttempt?: number;
  conflictResolution?: 'client-wins' | 'server-wins';
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Conflict details when a sync conflict occurs
 */
export interface SyncConflict<T = any> {
  syncRecord: SyncRecord<T>;
  serverData?: T;
  clientData: T;
  entityType: string;
  entityId: string;
  timestamp: number;
  resolution?: 'client-wins' | 'server-wins' | 'manual' | 'merge';
  resolved: boolean;
}

/**
 * Queue processing options
 */
export interface QueueProcessingOptions {
  batchSize: number;
  maxConcurrent: number;
  priorityFirst: boolean;
  onProgress?: (completed: number, total: number) => void;
  abortSignal?: AbortSignal;
}

/**
 * Storage options for edge store
 */
export interface EdgeStoreOptions {
  dbName: string;
  version: number;
  stores: Array<{
    name: string;
    keyPath: string;
    indices?: Array<{
      name: string;
      keyPath: string | string[];
      options?: IDBIndexParameters;
    }>;
  }>;
  upgradeCallback?: (
    db: IDBDatabase,
    oldVersion: number,
    newVersion: number | null,
    transaction: IDBTransaction
  ) => void;
}

/**
 * Query options for edge store
 */
export interface EdgeStoreQuery<T> {
  index?: string;
  range?: IDBKeyRange;
  direction?: IDBCursorDirection;
  limit?: number;
  offset?: number;
  filter?: (item: T) => boolean;
}

/**
 * Sync operation result
 */
export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  conflictsDetected: number;
  conflictsResolved: number;
  errors?: Error[];
  duration: number; // in ms
}

/**
 * Cache entry metadata
 */
export interface CacheEntryMetadata {
  url: string;
  timestamp: number;
  expiresAt?: number;
  etag?: string;
  lastModified?: string;
  size?: number;
  headers?: Record<string, string>;
}

/**
 * Realtime message
 */
export interface RealtimeMessage<T = any> {
  id: string;
  channel: string;
  data: T;
  timestamp: number;
  sender: string;
  messageType: string;
  metadata?: Record<string, any>;
}

/**
 * Presence information
 */
export interface PresenceInfo {
  clientId: string;
  data?: Record<string, any>;
  timestamp: number;
  connectionId: string;
  status: 'online' | 'away' | 'offline';
}