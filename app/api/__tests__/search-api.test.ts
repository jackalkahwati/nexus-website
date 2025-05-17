import { jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { searchService } from '@/lib/services/search'
import { handleSearch } from '../search/route'

// Mock search service
jest.mock('@/lib/services/search', () => ({
  searchService: {
    search: jest.fn(),
    index: jest.fn(),
    delete: jest.fn(),
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

describe('Search API', () => {
  const mockResults = {
    hits: [
      { id: '1', title: 'Test Result 1' },
      { id: '2', title: 'Test Result 2' }
    ],
    total: 2
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle valid search request', async () => {
    (searchService.search as jest.Mock).mockResolvedValueOnce(mockResults)

    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: 'test' })
    })

    const response = await handleSearch(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockResults)
    expect(searchService.search).toHaveBeenCalledWith('test')
  })

  it('should handle invalid JSON request', async () => {
    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await handleSearch(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid request body' })
    expect(mockLogger.error).toHaveBeenCalledWith('Search API error', {
      error: expect.any(Error)
    })
  })

  it('should handle empty request body', async () => {
    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await handleSearch(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Missing query parameter' })
    expect(mockLogger.error).toHaveBeenCalledWith('Search API error', {
      error: 'Missing query parameter'
    })
  })

  it('should handle service timeout errors', async () => {
    const error = new Error('Service timeout')
    ;(searchService.search as jest.Mock).mockRejectedValueOnce(error)

    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: 'test' })
    })

    const response = await handleSearch(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Internal server error' })
    expect(mockLogger.error).toHaveBeenCalledWith('Search API error', { error })
  })
}) 