// Core functionality
export * from './core/edge-config';
export * from './core/network-monitor';
export * from './core/device-capabilities';
export * from './core/service-worker-manager';

// Offline-first data management
export * from './storage/edge-store';
export * from './storage/cache-manager';
export * from './storage/quota-manager';

// Synchronization
export * from './sync/sync-manager';
export * from './sync/conflict-resolution';
export * from './sync/queue-manager';
export * from './sync/priority-queue';

// Real-time communication
export * from './realtime/realtime-client';
export * from './realtime/subscription-manager';
export * from './realtime/presence';

// Utilities and helpers
export * from './utils/error-handling';
export * from './utils/log';
export * from './utils/serialization';
export * from './utils/timing';

// Types
export * from './types';