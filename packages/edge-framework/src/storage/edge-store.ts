import { openDB, IDBPDatabase } from 'idb';
import { log } from '../utils/log';
import { errorHandler } from '../utils/error-handling';
import { EdgeStoreOptions, EdgeStoreQuery } from '../types';

/**
 * EdgeStore provides a simplified interface for working with IndexedDB,
 * optimized for offline-first applications with synchronization needs.
 */
export class EdgeStore {
  private dbPromise: Promise<IDBPDatabase>;
  private dbName: string;
  private version: number;

  /**
   * Create a new EdgeStore instance
   * 
   * @param options - Configuration options for the store
   */
  constructor(options: EdgeStoreOptions) {
    this.dbName = options.dbName;
    this.version = options.version;
    
    this.dbPromise = openDB(this.dbName, this.version, {
      upgrade: (database, oldVersion, newVersion, transaction) => {
        // Create the object stores and indexes defined in options
        for (const store of options.stores) {
          if (!database.objectStoreNames.contains(store.name)) {
            const objectStore = database.createObjectStore(store.name, { keyPath: store.keyPath });
            
            // Create indices if defined
            if (store.indices) {
              for (const index of store.indices) {
                objectStore.createIndex(index.name, index.keyPath, index.options);
              }
            }
          }
        }
        
        // Call the custom upgrade callback if provided
        if (options.upgradeCallback) {
          options.upgradeCallback(database, oldVersion, newVersion, transaction);
        }
      },
    });
  }

  /**
   * Get the database connection
   * 
   * @returns Promise resolving to the IDB database instance
   */
  public async getDatabase(): Promise<IDBPDatabase> {
    return this.dbPromise;
  }

  /**
   * Add an item to a store
   * 
   * @param storeName - Name of the object store
   * @param item - Item to add
   * @returns Promise resolving to the key of the added item
   */
  public async add<T>(storeName: string, item: T): Promise<IDBValidKey> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const key = await store.add(item);
      await tx.done;
      return key;
    } catch (error) {
      return errorHandler(`Failed to add item to ${storeName}`, error);
    }
  }

  /**
   * Put an item in a store (add or update)
   * 
   * @param storeName - Name of the object store
   * @param item - Item to put
   * @returns Promise resolving to the key of the added/updated item
   */
  public async put<T>(storeName: string, item: T): Promise<IDBValidKey> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const key = await store.put(item);
      await tx.done;
      return key;
    } catch (error) {
      return errorHandler(`Failed to put item in ${storeName}`, error);
    }
  }

  /**
   * Get an item from a store by key
   * 
   * @param storeName - Name of the object store
   * @param key - Key of the item to get
   * @returns Promise resolving to the item or undefined if not found
   */
  public async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    try {
      const db = await this.dbPromise;
      return db.get(storeName, key);
    } catch (error) {
      return errorHandler(`Failed to get item from ${storeName}`, error);
    }
  }

  /**
   * Delete an item from a store by key
   * 
   * @param storeName - Name of the object store
   * @param key - Key of the item to delete
   * @returns Promise resolving when the item is deleted
   */
  public async delete(storeName: string, key: IDBValidKey): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.delete(key);
      await tx.done;
    } catch (error) {
      return errorHandler(`Failed to delete item from ${storeName}`, error);
    }
  }

  /**
   * Clear all items from a store
   * 
   * @param storeName - Name of the object store to clear
   * @returns Promise resolving when the store is cleared
   */
  public async clear(storeName: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      await tx.done;
    } catch (error) {
      return errorHandler(`Failed to clear store ${storeName}`, error);
    }
  }

  /**
   * Get all items from a store
   * 
   * @param storeName - Name of the object store
   * @returns Promise resolving to all items in the store
   */
  public async getAll<T>(storeName: string): Promise<T[]> {
    try {
      const db = await this.dbPromise;
      return db.getAll(storeName);
    } catch (error) {
      return errorHandler(`Failed to get all items from ${storeName}`, error);
    }
  }

  /**
   * Query items from a store with filtering and sorting
   * 
   * @param storeName - Name of the object store
   * @param query - Query options
   * @returns Promise resolving to the queried items
   */
  public async query<T>(storeName: string, query: EdgeStoreQuery<T>): Promise<T[]> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      
      let source = store;
      if (query.index) {
        source = store.index(query.index);
      }
      
      const results: T[] = [];
      let cursor = await source.openCursor(query.range, query.direction);
      let count = 0;
      
      // Process cursor with offset
      if (query.offset && query.offset > 0) {
        let offsetCount = 0;
        while (cursor && offsetCount < query.offset) {
          cursor = await cursor.continue();
          offsetCount++;
        }
      }
      
      // Collect and filter results
      while (cursor) {
        const item = cursor.value as T;
        
        const includeItem = !query.filter || query.filter(item);
        
        if (includeItem) {
          results.push(item);
          count++;
          
          if (query.limit && count >= query.limit) {
            break;
          }
        }
        
        cursor = await cursor.continue();
      }
      
      await tx.done;
      return results;
    } catch (error) {
      return errorHandler(`Failed to query items from ${storeName}`, error);
    }
  }

  /**
   * Count the number of items in a store
   * 
   * @param storeName - Name of the object store
   * @param query - Optional query parameters
   * @returns Promise resolving to the count of items
   */
  public async count(storeName: string, query?: { index?: string; range?: IDBKeyRange }): Promise<number> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      
      let count: number;
      if (query?.index) {
        const index = store.index(query.index);
        count = await index.count(query.range);
      } else {
        count = await store.count(query?.range);
      }
      
      await tx.done;
      return count;
    } catch (error) {
      return errorHandler(`Failed to count items in ${storeName}`, error);
    }
  }

  /**
   * Execute a batch of operations in a single transaction
   * 
   * @param storeName - Name of the object store
   * @param operations - Array of operations to perform
   * @returns Promise resolving when all operations are complete
   */
  public async batch<T>(
    storeName: string,
    operations: Array<{
      type: 'add' | 'put' | 'delete';
      item?: T;
      key?: IDBValidKey;
    }>
  ): Promise<void> {
    if (operations.length === 0) return;
    
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      const promises = operations.map((op) => {
        switch (op.type) {
          case 'add':
            if (!op.item) throw new Error('Item is required for add operation');
            return store.add(op.item);
          case 'put':
            if (!op.item) throw new Error('Item is required for put operation');
            return store.put(op.item);
          case 'delete':
            if (!op.key) throw new Error('Key is required for delete operation');
            return store.delete(op.key);
          default:
            throw new Error(`Unknown operation type: ${(op as any).type}`);
        }
      });
      
      await Promise.all(promises);
      await tx.done;
    } catch (error) {
      return errorHandler(`Failed to execute batch operations on ${storeName}`, error);
    }
  }

  /**
   * Delete the entire database
   * 
   * @returns Promise resolving when the database is deleted
   */
  public async deleteDatabase(): Promise<void> {
    try {
      // Close the database connection first
      const db = await this.dbPromise;
      db.close();
      
      // Delete the database
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(this.dbName);
        
        request.onerror = () => {
          reject(new Error(`Failed to delete database ${this.dbName}`));
        };
        
        request.onsuccess = () => {
          log('info', `Database ${this.dbName} successfully deleted`);
          resolve();
        };
      });
    } catch (error) {
      return errorHandler(`Failed to delete database ${this.dbName}`, error);
    }
  }
}