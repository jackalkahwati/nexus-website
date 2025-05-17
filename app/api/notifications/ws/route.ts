import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a placeholder for WebSocket functionality
// In Next.js, WebSocket support requires additional setup with a custom server
// For now, we'll use Server-Sent Events (SSE) as a fallback

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      
      // Send a test notification every 30 seconds
      const interval = setInterval(() => {
        const notification = {
          id: Date.now().toString(),
          title: 'Test Notification',
          description: 'This is a test notification from the server.',
          time: new Date().toISOString(),
          type: 'info',
          read: false,
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(notification)}\n\n`))
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}