import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import webpush from 'web-push'

// Configure web-push with VAPID keys
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
}

webpush.setVapidDetails(
  'mailto:support@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// In-memory store for subscriptions (replace with database in production)
let subscriptions: PushSubscription[] = []

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()
    
    // Store the subscription
    subscriptions.push(subscription)

    // Send a test notification
    const payload = JSON.stringify({
      title: 'Push Notifications Enabled',
      description: 'You will now receive important alerts.',
      type: 'success',
    })

    await webpush.sendNotification(subscription, payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to push notifications' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const subscription = await request.json()
    
    // Remove the subscription
    subscriptions = subscriptions.filter(
      sub => sub.endpoint !== subscription.endpoint
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from push notifications' },
      { status: 500 }
    )
  }
} 