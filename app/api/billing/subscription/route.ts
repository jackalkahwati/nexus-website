import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from 'next-auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia"
})

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()

    // In a real app, get the user's customer ID from your database
    const customerId = "cus_123" // Example customer ID

    // Check if customer already has a subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active'
    })

    if (subscriptions.data.length > 0) {
      // Update existing subscription
      const subscription = await stripe.subscriptions.update(subscriptions.data[0].id, {
        items: [{
          id: subscriptions.data[0].items.data[0].id,
          price: priceId
        }],
        proration_behavior: 'create_prorations'
      })

      return NextResponse.json({ subscription })
    } else {
      // Create Stripe Checkout session for new subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1
        }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile/billing?canceled=true`
      })

      return NextResponse.json({ url: session.url })
    }
  } catch (error) {
    console.error('Error managing subscription:', error)
    return NextResponse.json({ error: 'Failed to manage subscription' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // In a real app, get the user's customer ID from your database
    const customerId = "cus_123" // Example customer ID

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active'
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const subscription = await stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
} 