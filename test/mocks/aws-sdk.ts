import { jest } from '@jest/globals';

// Define AWS SDK types
interface CloudWatchLogsEvent {
  logGroupName: string;
  logStreamName: string;
  logEvents: Array<{
    timestamp: number;
    message: string;
  }>;
  sequenceToken?: string;
}

interface CloudWatchLogsResponse {
  $metadata: {
    httpStatusCode: number;
    requestId?: string;
    attempts?: number;
    totalRetryDelay?: number;
  };
  nextSequenceToken?: string;
}

interface RetryToken {
  getRetryCount: () => number;
  getRetryDelay: () => number;
}

// Mock CloudWatch Logs Client
export class CloudWatchLogsClient {
  constructor(config: any) {
    // Configuration not needed for mock
  }

  async send(command: any): Promise<CloudWatchLogsResponse> {
    return {
      $metadata: {
        httpStatusCode: 200,
        requestId: 'test-request-id',
        attempts: 1
      },
      nextSequenceToken: 'test-sequence-token'
    };
  }
}

// Mock CloudWatch Logs Commands
export class PutLogEventsCommand {
  readonly input: CloudWatchLogsEvent;

  constructor(input: CloudWatchLogsEvent) {
    this.input = input;
  }

  middlewareStack = {
    add: jest.fn(),
    addRelativeTo: jest.fn(),
    clone: jest.fn(),
    remove: jest.fn(),
    use: jest.fn(),
    resolve: jest.fn()
  };
}

export class CreateLogGroupCommand {
  readonly input: { logGroupName: string };

  constructor(input: { logGroupName: string }) {
    this.input = input;
  }

  middlewareStack = {
    add: jest.fn(),
    addRelativeTo: jest.fn(),
    clone: jest.fn(),
    remove: jest.fn(),
    use: jest.fn(),
    resolve: jest.fn()
  };
}

export class CreateLogStreamCommand {
  readonly input: { logGroupName: string; logStreamName: string };

  constructor(input: { logGroupName: string; logStreamName: string }) {
    this.input = input;
  }

  middlewareStack = {
    add: jest.fn(),
    addRelativeTo: jest.fn(),
    clone: jest.fn(),
    remove: jest.fn(),
    use: jest.fn(),
    resolve: jest.fn()
  };
}

// Mock S3 Client
export class S3Client {
  constructor(config: any) {
    // Configuration not needed for mock
  }

  async send(command: any): Promise<{ $metadata: { httpStatusCode: number } }> {
    return {
      $metadata: {
        httpStatusCode: 200
      }
    };
  }
}

// Mock middleware retry
export const defaultRetryToken: RetryToken = {
  getRetryCount: () => 0,
  getRetryDelay: () => 0,
};

export class StandardRetryStrategy {
  constructor(maxRetries?: number) {
    // Configuration not needed for mock
  }

  async retry(next: any, args: any): Promise<RetryToken> {
    return defaultRetryToken;
  }
}

// Mock middleware
export const middleware = {
  retry: {
    RetryStrategy: StandardRetryStrategy,
    defaultRetryToken
  }
};

// Mock Credentials
export class Credentials {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly sessionToken?: string;

  constructor(accessKeyId: string, secretAccessKey: string, sessionToken?: string) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
  }
} 