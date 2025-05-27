import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mock database for demo purposes
let notifications = [
  {
    id: '1',
    title: 'Critical Battery Alert',
    description: 'Vehicle #1432 battery level is critically low (15%). Immediate charging required.',
    time: new Date().toISOString(),
    type: 'alert',
    read: false,
  },
  {
    id: '2',
    title: 'Maintenance Reminder',
    description: 'Scheduled maintenance due for 3 vehicles in the next 48 hours.',
    time: new Date().toISOString(),
    type: 'warning',
    read: false,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const read = searchParams.get('read')

  let filteredNotifications = [...notifications]

  if (type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === type)
  }

  if (read) {
    filteredNotifications = filteredNotifications.filter(n => n.read === (read === 'true'))
  }

  return NextResponse.json(filteredNotifications)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const newNotification = {
    id: Date.now().toString(),
    title: body.title,
    description: body.description,
    time: new Date().toISOString(),
    type: body.type || 'info',
    read: false,
  }

  notifications.unshift(newNotification)

  // In a real application, you would:
  // 1. Save to database
  // 2. Emit WebSocket event
  // 3. Send push notification if enabled
  // 4. Send email if enabled

  return NextResponse.json(newNotification)
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, read } = body

  notifications = notifications.map(notification =>
    notification.id === id
      ? { ...notification, read }
      : notification
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  notifications = notifications.filter(notification => notification.id !== id)

  return NextResponse.json({ success: true })
} 