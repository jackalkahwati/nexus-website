import { NextResponse } from 'next/server'
import { searchService } from '@/lib/services/search'
import { logger } from '@/lib/services/logging'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    const analytics = await searchService.getSearchAnalytics(days)
    return NextResponse.json(analytics)
  } catch (error) {
    logger.error('Search analytics API error', { error })
    return NextResponse.json(
      { error: 'Failed to fetch search analytics' },
      { status: 500 }
    )
  }
} 