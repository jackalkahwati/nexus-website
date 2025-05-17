import { SearchService } from '../search'
import { Client } from '@elastic/elasticsearch'
import type { SearchResponse, SearchHit } from '@elastic/elasticsearch/lib/api/types'
import { env } from '../../../config/env'

interface TestDocument {
  title: string;
  content: string;
  category?: string;
}

interface MockSearchResponse extends SearchResponse<TestDocument> {
  hits: {
    hits: Array<SearchHit<TestDocument>>;
    total: { value: number };
  };
  aggregations?: {
    categories: {
      buckets: Array<{
        key: string;
        doc_count: number;
      }>;
    };
  };
}

// Mock the config module
jest.mock('../../../config/env', () => ({
  env: {
    elasticsearch: {
      node: 'http://localhost:9200',
      username: 'test-user',
      password: 'test-pass',
    },
  },
}))

jest.mock('@elastic/elasticsearch', () => ({
  Client: jest.fn().mockImplementation(() => ({
    search: jest.fn(),
    index: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  })),
}))

describe('SearchService', () => {
  let searchService: SearchService
  let mockClient: jest.Mocked<Client>

  beforeEach(() => {
    jest.clearAllMocks()
    searchService = new SearchService()
    mockClient = (searchService as any).client
  })

  describe('search', () => {
    it('should perform search with correct parameters', async () => {
      const mockResponse: MockSearchResponse = {
        hits: {
          hits: [
            {
              _id: '1',
              _index: 'content',
              _score: 1,
              _source: {
                title: 'Test',
                content: 'Test content',
              },
            },
          ],
          total: { value: 1 },
        },
        aggregations: {
          categories: {
            buckets: [
              { key: 'test', doc_count: 1 },
            ],
          },
        },
      }

      mockClient.search.mockResolvedValue(mockResponse)

      const result = await searchService.search('content', {
        query: 'test',
        page: 1,
        limit: 10,
      })

      expect(mockClient.search).toHaveBeenCalledWith({
        index: 'content',
        from: 0,
        size: 10,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: 'test',
                  fields: ['title^2', 'content'],
                  fuzziness: 'AUTO',
                },
              },
            ],
          },
        },
        sort: undefined,
        aggs: {
          categories: {
            terms: { field: 'category.keyword' },
          },
        },
      })

      expect(result).toEqual({
        hits: [
          {
            id: '1',
            score: 1,
            title: 'Test',
            content: 'Test content',
          },
        ],
        total: 1,
        aggregations: {
          categories: {
            buckets: [
              { key: 'test', doc_count: 1 },
            ],
          },
        },
      })
    })

    it('should handle search with filters and sorting', async () => {
      const mockResponse: MockSearchResponse = {
        hits: {
          hits: [],
          total: { value: 0 },
        },
        aggregations: {
          categories: {
            buckets: [],
          },
        },
      }

      mockClient.search.mockResolvedValue(mockResponse)

      await searchService.search('content', {
        query: 'test',
        filters: { category: 'blog' },
        sort: 'date',
        order: 'desc',
      })

      expect(mockClient.search).toHaveBeenCalledWith({
        index: 'content',
        from: 0,
        size: 10,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: 'test',
                  fields: ['title^2', 'content'],
                  fuzziness: 'AUTO',
                },
              },
              {
                term: { category: 'blog' },
              },
            ],
          },
        },
        sort: [{ date: { order: 'desc' } }],
        aggs: {
          categories: {
            terms: { field: 'category.keyword' },
          },
        },
      })
    })

    it('should handle errors', async () => {
      const error = new Error('Search failed')
      mockClient.search.mockRejectedValue(error)

      await expect(searchService.search('content', { query: 'test' }))
        .rejects.toThrow('Search failed')
    })
  })

  describe('indexDocument', () => {
    it('should index document correctly', async () => {
      const document: TestDocument = { title: 'Test', content: 'Test content' }
      await searchService.indexDocument('content', document)

      expect(mockClient.index).toHaveBeenCalledWith({
        index: 'content',
        document,
      })
    })
  })

  describe('deleteDocument', () => {
    it('should delete document correctly', async () => {
      await searchService.deleteDocument('content', '1')

      expect(mockClient.delete).toHaveBeenCalledWith({
        index: 'content',
        id: '1',
      })
    })
  })

  describe('updateDocument', () => {
    it('should update document correctly', async () => {
      const document: Partial<TestDocument> = { title: 'Updated Test' }
      await searchService.updateDocument('content', '1', document)

      expect(mockClient.update).toHaveBeenCalledWith({
        index: 'content',
        id: '1',
        doc: document,
      })
    })
  })
})
