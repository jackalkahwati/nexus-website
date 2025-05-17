import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from 'next-auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia"
})

export async function GET() {
  try {
    // In a real app, get the user's customer ID from your database
    const customerId = "cus_123" // Example customer ID

    // Get customer's subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active',
      expand: ['data.default_payment_method']
    })

    const subscription = subscriptions.data[0]

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        paymentMethod: null
      })
    }

    // Get payment method
    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        planId: subscription.items.data[0].price.product as string,
        stripeSubscriptionId: subscription.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      },
      paymentMethod: paymentMethod ? {
        brand: paymentMethod.card!.brand,
        last4: paymentMethod.card!.last4,
        expiryMonth: paymentMethod.card!.exp_month,
        expiryYear: paymentMethod.card!.exp_year
      } : null
    })
  } catch (error) {
    console.error('Error fetching billing info:', error)
    return NextResponse.json({ error: 'Failed to fetch billing information' }, { status: 500 })
  }
} 