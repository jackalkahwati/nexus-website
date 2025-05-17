import { Logger as WinstonLogger } from 'winston';

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export interface Logger {
  // Core logging methods
  log: (level: LogLevel, message: string, metadata?: Record<string, any>) => void;
  error: (message: string | Error, metadata?: Record<string, any>) => void;
  warn: (message: string, metadata?: Record<string, any>) => void;
  info: (message: string, metadata?: Record<string, any>) => void;
  debug: (message: string, metadata?: Record<string, any>) => void;

  // Context management
  setContext: (context: Record<string, any>) => void;
  clearContext: () => void;
  child: (context: Record<string, any>) => Logger;
  forRequest: (requestId: string, method: string, url: string) => Logger;

  // Lifecycle management
  close: () => Promise<void>;
  isClosed: () => boolean;
}

// Separate interface for Winston-specific logger instance
export interface WinstonLoggerInstance {
  on: (event: string, listener: (...args: any[]) => void) => void;
  end: () => void;
  close: () => Promise<void>;
  log: (info: { level: string; message: string; [key: string]: any }) => void;
  info: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}

// Audit logging specific types
export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'read'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'share'
  | 'revoke'
  | 'rotate'
  | 'access_denied'
  | 'error';

export type ResourceType =
  | 'user'
  | 'file'
  | 'payment'
  | 'subscription'
  | 'settings'
  | 'integration'
  | 'api_key'
  | 'role'
  | 'profile'
  | 'secret';

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: AuditAction;
  resource: ResourceType;
  resourceId: string;
  details?: Record<string, any>;
  createdAt: Date;
  ip?: string;
  userAgent?: string;
}

export interface AuditLogOptions {
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// Secret-specific audit types
export type SecretAuditAction = Extract<
  AuditAction,
  'create' | 'update' | 'delete' | 'read' | 'share' | 'revoke' | 'rotate' | 'access_denied' | 'error'
>;

export interface SecretAuditLogEntry extends AuditLogEntry {
  action: SecretAuditAction;
  resource: 'secret';
  details: {
    name: string;
    metadata?: Record<string, any>;
    error?: string;
    stack?: string;
  };
}

// Queue management types
export interface LogQueue {
  enqueue: (logFn: () => void) => void;
  process: () => Promise<void>;
  clear: () => void;
  size: () => number;
  isProcessing: () => boolean;
}

// Logger configuration types
export interface LoggerConfig {
  level?: LogLevel;
  service?: string;
  environment?: string;
  maxSize?: number;
  maxFiles?: number;
  logDir?: string;
  compress?: boolean;
}

// Logger factory type
export interface LoggerFactory {
  createLogger: (config: LoggerConfig) => Logger;
  getInstance: () => Logger;
  resetInstance: () => void;
}
