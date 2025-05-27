import { jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { SearchService } from '@/lib/services/search'

// Mock environment configuration
jest.mock('@/lib/config/env', () => ({
  env: {
    elasticsearch: {
      node: 'http://localhost:9200',
      username: 'test-user',
      password: 'test-pass',
      index: 'test-index'
    }
  }
}))

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: mockLogger,
}))

describe('SearchService', () => {
  let searchService: SearchService

  beforeEach(() => {
    jest.clearAllMocks()
    searchService = new SearchService()
  })

  it('should initialize with correct configuration', () => {
    expect(searchService).toBeDefined()
    expect((searchService as any).client).toBeDefined()
    expect((searchService as any).config.node).toBe('http://localhost:9200')
    expect((searchService as any).config.index).toBe('test-index')
  })

  it('should perform search with correct parameters', async () => {
    const mockResponse = {
      hits: {
        hits: [
          {
            _source: {
              title: 'Test Document',
              content: 'Test Content'
            }
          }
        ]
      }
    }

    // Mock the search method
    jest.spyOn((searchService as any).client, 'search')
      .mockResolvedValueOnce(mockResponse)

    const result = await searchService.search('test query')
    
    expect(result).toEqual(mockResponse.hits.hits)
    expect((searchService as any).client.search).toHaveBeenCalledWith({
      index: 'test-index',
      query: {
        multi_match: {
          query: 'test query',
          fields: ['title', 'content', 'tags']
        }
      }
    })
  })

  it('should handle search errors gracefully', async () => {
    const error = new Error('Search failed')
    jest.spyOn((searchService as any).client, 'search')
      .mockRejectedValueOnce(error)

    await expect(searchService.search('test query'))
      .rejects.toThrow('Search failed')
  })

  it('should index documents correctly', async () => {
    const mockDocument = {
      title: 'Test Document',
      content: 'Test Content'
    }

    const mockResponse = {
      result: 'created',
      _id: '123'
    }

    jest.spyOn((searchService as any).client, 'index')
      .mockResolvedValueOnce(mockResponse)

    const result = await searchService.index(mockDocument)
    
    expect(result).toEqual(mockResponse)
    expect((searchService as any).client.index).toHaveBeenCalledWith({
      index: 'test-index',
      document: mockDocument
    })
  })

  it('should delete documents correctly', async () => {
    const mockResponse = {
      result: 'deleted'
    }

    jest.spyOn((searchService as any).client, 'delete')
      .mockResolvedValueOnce(mockResponse)

    const result = await searchService.delete('123')
    
    expect(result).toEqual(mockResponse)
    expect((searchService as any).client.delete).toHaveBeenCalledWith({
      index: 'test-index',
      id: '123'
    })
  })
})
