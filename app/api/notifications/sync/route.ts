import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mock database for missed notifications
const missedNotifications = [
  {
    id: '3',
    title: 'Missed Alert',
    description: 'This notification was queued while you were offline.',
    time: new Date().toISOString(),
    type: 'info',
    read: false,
  },
]

export async function GET(request: NextRequest) {
  // In a real application, you would:
  // 1. Get user's last sync timestamp
  // 2. Query database for missed notifications
  // 3. Mark notifications as synced
  
  return NextResponse.json(missedNotifications)
} 