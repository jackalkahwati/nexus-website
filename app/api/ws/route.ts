import { NextResponse } from 'next/server'
import { logger } from '@/lib/logging/logger'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // Validate connection
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Create WebSocket pair
    const { 0: client, 1: server } = new WebSocketPair()

    // Handle WebSocket connection
    server.accept()
    server.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data)
        logger.info('WebSocket message received', { data })
        
        // Echo back the message
        server.send(JSON.stringify({
          type: 'message',
          data: data
        }))
      } catch (error) {
        logger.error('Error handling WebSocket message', { error })
      }
    })

    server.addEventListener('close', () => {
      logger.info('WebSocket connection closed')
    })

    return new Response(null, {
      status: 101,
      webSocket: client
    })
  } catch (error) {
    logger.error('Error establishing WebSocket connection', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
