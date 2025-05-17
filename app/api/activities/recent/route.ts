import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'

const CACHE_KEY = 'recent_activities'
const CACHE_TTL = 60 // 1 minute

export async function GET() {
  try {
    // Try to get from cache first
    const cached = await redis.get<string>(CACHE_KEY)
    if (cached) {
      return NextResponse.json(JSON.parse(cached))
    }

    // If not in cache, fetch from database
    const activities = await prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    // Transform data
    const transformed = activities.map(activity => ({
      id: activity.id,
      user: {
        name: activity.user.name,
        avatar: activity.user.image
      },
      action: activity.action,
      target: activity.target,
      time: activity.createdAt.toISOString()
    }))

    // Cache the result
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(transformed))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
