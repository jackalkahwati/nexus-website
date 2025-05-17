import { v4 as uuidv4 } from 'uuid';
import { QueueManager } from './queue-manager';
import { ConflictResolutionManager } from './conflict-resolution';
import { NetworkMonitor } from '../core/network-monitor';
import { EdgeStore } from '../storage/edge-store';
import { errorHandler } from '../utils/error-handling';
import { log } from '../utils/log';
import { EdgeConfig, SyncRecord, SyncResult, NetworkStatus } from '../types';

/**
 * SyncManager is responsible for managing data synchronization between
 * the client and server, handling offline operations, and resolving conflicts.
 */
export class SyncManager {
  private queueManager: QueueManager;
  private conflictManager: ConflictResolutionManager;
  private networkMonitor: NetworkMonitor;
  private edgeStore: EdgeStore;
  private config: EdgeConfig;
  private deviceId: string;
  private syncInterval: number;
  private syncTimer: NodeJS.Timeout | null = null;
  private syncInProgress = false;
  private lastSyncTime = 0;
  private eventListeners: Map<string, Function[]> = new Map();

  /**
   * Create a new SyncManager instance
   * 
   * @param config - Edge framework configuration
   * @param queueManager - Queue manager instance
   * @param conflictManager - Conflict resolution manager instance
   * @param networkMonitor - Network monitor instance
   * @param edgeStore - Edge store instance
   */
  constructor(
    config: EdgeConfig,
    queueManager: QueueManager,
    conflictManager: ConflictResolutionManager,
    networkMonitor: NetworkMonitor,
    edgeStore: EdgeStore
  ) {
    this.config = config;
    this.queueManager = queueManager;
    this.conflictManager = conflictManager;
    this.networkMonitor = networkMonitor;
    this.edgeStore = edgeStore;
    this.syncInterval = config.syncInterval;
    this.deviceId = this.getOrCreateDeviceId();

    // Set up network status change listener
    this.networkMonitor.addEventListener('statusChange', (status: NetworkStatus) => {
      if (status === 'online') {
        log('info', 'Network is online, triggering sync');
        this.sync();
      }
    });
  }

  /**
   * Get or create a unique device ID for this client
   */
  private getOrCreateDeviceId(): string {
    const storageKey = `${this.config.appName}-device-id`;
    let deviceId = localStorage.getItem(storageKey);
    
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem(storageKey, deviceId);
    }
    
    return deviceId;
  }

  /**
   * Start the automatic synchronization process
   */
  public startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = setInterval(() => {
      if (this.networkMonitor.isOnline()) {
        this.sync();
      }
    }, this.syncInterval);
    
    log('info', `Auto sync started with interval: ${this.syncInterval}ms`);
  }

  /**
   * Stop the automatic synchronization process
   */
  public stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
      log('info', 'Auto sync stopped');
    }
  }

  /**
   * Register a change that needs to be synchronized
   * 
   * @param entityType - Type of entity being changed
   * @param entityId - ID of the entity being changed
   * @param changeType - Type of change (create, update, delete)
   * @param data - Data to be synchronized (for create/update)
   * @param priority - Priority level (higher values = higher priority)
   * @returns ID of the created sync record
   */
  public async registerChange<T>(
    entityType: string,
    entityId: string,
    changeType: 'create' | 'update' | 'delete',
    data?: T,
    priority = 1
  ): Promise<string> {
    try {
      const syncRecord: SyncRecord<T> = {
        id: uuidv4(),
        entityType,
        entityId,
        changeType,
        data,
        timestamp: Date.now(),
        deviceId: this.deviceId,
        status: 'pending',
        retryCount: 0,
        priority: Math.max(0, Math.min(this.config.priorityLevels - 1, priority)),
      };
      
      await this.queueManager.enqueue(syncRecord);
      
      // If we're online and not currently syncing, trigger a sync
      if (this.networkMonitor.isOnline() && !this.syncInProgress) {
        this.sync();
      }
      
      this.dispatchEvent('changeRegistered', { syncRecord });
      
      return syncRecord.id;
    } catch (error) {
      return errorHandler('Failed to register change', error);
    }
  }

  /**
   * Manually trigger synchronization
   * 
   * @returns Promise that resolves to the sync result
   */
  public async sync(): Promise<SyncResult> {
    if (this.syncInProgress) {
      log('info', 'Sync already in progress, skipping');
      return {
        success: false,
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        conflictsDetected: 0,
        conflictsResolved: 0,
        errors: [new Error('Sync already in progress')],
        duration: 0,
      };
    }
    
    if (!this.networkMonitor.isOnline()) {
      log('info', 'Network is offline, skipping sync');
      return {
        success: false,
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        conflictsDetected: 0,
        conflictsResolved: 0,
        errors: [new Error('Network is offline')],
        duration: 0,
      };
    }
    
    const startTime = Date.now();
    this.syncInProgress = true;
    this.dispatchEvent('syncStart', { timestamp: startTime });
    
    try {
      log('info', 'Starting sync process');
      
      // Process the sync queue
      const result = await this.queueManager.processQueue({
        batchSize: 50,
        maxConcurrent: this.config.maxConcurrentRequests,
        priorityFirst: true,
        onProgress: (completed, total) => {
          this.dispatchEvent('syncProgress', { completed, total });
        },
      });
      
      // Update last sync time
      this.lastSyncTime = Date.now();
      
      const duration = this.lastSyncTime - startTime;
      log('info', `Sync completed in ${duration}ms`);
      
      // Construct final result
      const syncResult: SyncResult = {
        success: result.recordsFailed === 0,
        recordsProcessed: result.recordsProcessed,
        recordsSucceeded: result.recordsSucceeded,
        recordsFailed: result.recordsFailed,
        conflictsDetected: result.conflictsDetected,
        conflictsResolved: result.conflictsResolved,
        errors: result.errors,
        duration,
      };
      
      this.dispatchEvent('syncComplete', syncResult);
      return syncResult;
    } catch (error) {
      const errorResult: SyncResult = {
        success: false,
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        conflictsDetected: 0,
        conflictsResolved: 0,
        errors: [error instanceof Error ? error : new Error(String(error))],
        duration: Date.now() - startTime,
      };
      
      this.dispatchEvent('syncError', { error });
      return errorResult;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Get the current sync status
   */
  public getSyncStatus() {
    return {
      syncInProgress: this.syncInProgress,
      lastSyncTime: this.lastSyncTime,
      pendingChanges: this.queueManager.getQueueSize(),
      isAutoSyncEnabled: this.syncTimer !== null,
      syncInterval: this.syncInterval,
      networkStatus: this.networkMonitor.getStatus(),
    };
  }

  /**
   * Add an event listener
   * 
   * @param event - Event name
   * @param callback - Callback function
   */
  public addEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove an event listener
   * 
   * @param event - Event name
   * @param callback - Callback function
   */
  public removeEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      return;
    }
    
    const listeners = this.eventListeners.get(event)!;
    const index = listeners.indexOf(callback);
    
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Dispatch an event to all listeners
   * 
   * @param event - Event name
   * @param data - Event data
   */
  private dispatchEvent(event: string, data: any): void {
    if (!this.eventListeners.has(event)) {
      return;
    }
    
    for (const callback of this.eventListeners.get(event)!) {
      try {
        callback(data);
      } catch (error) {
        log('error', `Error in event listener for ${event}:`, error);
      }
    }
  }

  /**
   * Set the sync interval
   * 
   * @param interval - Interval in milliseconds
   */
  public setSyncInterval(interval: number): void {
    this.syncInterval = interval;
    
    if (this.syncTimer) {
      this.stopAutoSync();
      this.startAutoSync();
    }
  }

  /**
   * Get pending sync records
   * 
   * @param entityType - Optional entity type filter
   * @param status - Optional status filter
   */
  public async getPendingSyncRecords<T>(
    entityType?: string,
    status?: 'pending' | 'processing' | 'completed' | 'failed'
  ): Promise<SyncRecord<T>[]> {
    return this.queueManager.getRecords(entityType, status);
  }

  /**
   * Clean up completed sync records
   * 
   * @param maxAge - Maximum age in milliseconds (default: 7 days)
   */
  public async cleanupCompletedRecords(maxAge = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    const cutoffTime = Date.now() - maxAge;
    return this.queueManager.cleanupRecords('completed', cutoffTime);
  }
}