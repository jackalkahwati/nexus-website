import { NextRequest, NextResponse } from 'next/server'
import { searchService } from '@/lib/services/search'
import logger from '@/lib/logger'

interface SearchRequest {
  query: string
  limit?: number
  offset?: number
}

interface SearchResponse {
  results: any[]
  total?: number
  error?: string
}

export async function POST(req: NextRequest) {
  try {
    let body: SearchRequest
    try {
      body = await req.json()
    } catch (error) {
      logger.error('Search API error: Invalid JSON', { error })
      return NextResponse.json<SearchResponse>(
        { error: 'Invalid request body', results: [] },
        { status: 400 }
      )
    }

    if (!body.query?.trim()) {
      const error = 'Missing or empty query parameter'
      logger.error('Search API error: Validation', { error })
      return NextResponse.json<SearchResponse>(
        { error, results: [] },
        { status: 400 }
      )
    }

    const limit = Math.min(body.limit || 10, 100) // Default 10, max 100
    const offset = Math.max(body.offset || 0, 0) // Default 0, min 0

    logger.debug('Processing search request', { 
      query: body.query,
      limit,
      offset
    })

    const results = await searchService.search(body.query)
    
    return NextResponse.json<SearchResponse>({
      results,
      total: results.length
    })

  } catch (error) {
    logger.error('Search API error: Internal', { error })
    return NextResponse.json<SearchResponse>(
      { error: 'Internal server error', results: [] },
      { status: 500 }
    )
  }
}
