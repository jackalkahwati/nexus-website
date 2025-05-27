import { jest } from '@jest/globals'

// Define Elasticsearch types
interface ElasticsearchConfig {
  node: string;
  auth: {
    username: string;
    password: string;
  };
  index?: string;
}

interface SearchResponse<T> {
  hits: {
    hits: Array<{
      _source: T;
      _id: string;
      _index: string;
      _score: number;
    }>;
    total: {
      value: number;
      relation: 'eq' | 'gte';
    };
  };
  aggregations?: Record<string, any>;
  took: number;
  timed_out: boolean;
}

interface CountResponse {
  count: number;
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
}

interface IndexResponse {
  _index: string;
  _id: string;
  _version: number;
  result: 'created' | 'updated';
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
}

interface UpdateResponse {
  _index: string;
  _id: string;
  _version: number;
  result: 'updated';
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
}

interface DeleteResponse {
  _index: string;
  _id: string;
  result: 'deleted';
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
}

interface BulkResponse {
  took: number;
  errors: boolean;
  items: Array<{
    [action: string]: {
      _index: string;
      _id: string;
      status: number;
      result?: string;
      error?: {
        type: string;
        reason: string;
      };
    };
  }>;
}

// Default configuration
export const config: ElasticsearchConfig = {
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'changeme'
  }
};

// Mock Client class
export class Client {
  private options: ElasticsearchConfig;
  
  // Mock functions
  search = jest.fn();
  index = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  count = jest.fn();
  bulk = jest.fn();
  
  constructor(options: Partial<ElasticsearchConfig> = {}) {
    this.options = { ...config, ...options };
    
    // Setup default mock implementations
    this.search.mockImplementation(this._mockSearch.bind(this));
    this.index.mockImplementation(this._mockIndex.bind(this));
    this.update.mockImplementation(this._mockUpdate.bind(this));
    this.delete.mockImplementation(this._mockDelete.bind(this));
    this.count.mockImplementation(this._mockCount.bind(this));
    this.bulk.mockImplementation(this._mockBulk.bind(this));
  }

  async _mockSearch<T = any>(params: any): Promise<SearchResponse<T>> {
    const index = params.index || 'default';
    
    // Generate mock response data based on the query
    let mockResults: any[] = [
      {
        id: '1',
        title: 'Test Document 1',
        content: 'This is a test document with content about testing',
        category: 'test',
        date: '2024-01-01'
      },
      {
        id: '2',
        title: 'Another Test Document',
        content: 'More content for testing search functionality',
        category: 'blog',
        date: '2024-01-02'
      }
    ];
    
    // Add aggregations if requested
    const aggs: Record<string, any> = {};
    if (params.aggs && params.aggs.categories) {
      aggs.categories = {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          { key: 'test', doc_count: 1 },
          { key: 'blog', doc_count: 1 }
        ]
      };
    }
    
    return {
      hits: {
        hits: mockResults.map((doc, i) => ({
          _source: doc as T,
          _id: doc.id,
          _index: index,
          _score: 1.0 - (i * 0.2)
        })),
        total: {
          value: mockResults.length,
          relation: 'eq'
        }
      },
      ...(Object.keys(aggs).length > 0 ? { aggregations: aggs } : {}),
      took: 5,
      timed_out: false
    };
  }

  async _mockIndex(params: any): Promise<IndexResponse> {
    return {
      _index: params.index,
      _id: params.id || 'mock-id',
      _version: 1,
      result: 'created',
      _shards: {
        total: 2,
        successful: 2,
        failed: 0
      }
    };
  }
  
  async _mockUpdate(params: any): Promise<UpdateResponse> {
    return {
      _index: params.index,
      _id: params.id,
      _version: 2,
      result: 'updated',
      _shards: {
        total: 2,
        successful: 2,
        failed: 0
      }
    };
  }

  async _mockDelete(params: any): Promise<DeleteResponse> {
    return {
      _index: params.index,
      _id: params.id,
      result: 'deleted',
      _shards: {
        total: 2,
        successful: 2,
        failed: 0
      }
    };
  }
  
  async _mockCount(params: any): Promise<CountResponse> {
    return {
      count: 2,
      _shards: {
        total: 1,
        successful: 1,
        failed: 0
      }
    };
  }

  async _mockBulk(params: any): Promise<BulkResponse> {
    // Extract operations from the body
    const operations = Array.isArray(params.body) ? params.body : [];
    const numOperations = Math.floor(operations.length / 2);
    
    return {
      took: 10,
      errors: false,
      items: Array(numOperations).fill(null).map((_, i) => ({
        index: {
          _index: params.index || 'default',
          _id: `bulk-${i}`,
          status: 200,
          result: 'created'
        }
      }))
    };
  }

  indices = {
    create: jest.fn().mockResolvedValue({ acknowledged: true }),
    delete: jest.fn().mockResolvedValue({ acknowledged: true }),
    exists: jest.fn().mockResolvedValue(true),
    refresh: jest.fn().mockResolvedValue({ 
      _shards: { total: 1, successful: 1, failed: 0 } 
    })
  };
} 