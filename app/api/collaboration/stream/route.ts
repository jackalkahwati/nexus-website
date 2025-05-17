import { NextResponse } from 'next/server'
import { logger } from "@/lib/logging/logger"

export const runtime = 'edge'

// Keep track of active users (in a real app, this would be in a database/cache)
let activeUsers = 0

export async function GET() {
  const encoder = new TextEncoder()

  try {
    activeUsers++
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const message = {
          type: 'presence',
          activeUsers
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`))

        // Send periodic updates
        const interval = setInterval(() => {
          const update = {
            type: 'presence',
            activeUsers
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`))
        }, 30000) // Send update every 30 seconds

        // Cleanup on close
        return () => {
          clearInterval(interval)
          activeUsers = Math.max(0, activeUsers - 1)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    logger.error('Error establishing collaboration stream', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
