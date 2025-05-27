import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from 'next-auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia"
})

export async function PUT(req: NextRequest) {
  try {
    const { paymentMethodId } = await req.json()

    // In a real app, get the user's customer ID from your database
    const customerId = "cus_123" // Example customer ID

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // Update subscription with new payment method
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active'
    })

    if (subscriptions.data.length > 0) {
      await stripe.subscriptions.update(subscriptions.data[0].id, {
        default_payment_method: paymentMethodId
      })
    }

    // Get updated payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

    return NextResponse.json({
      paymentMethod: {
        brand: paymentMethod.card!.brand,
        last4: paymentMethod.card!.last4,
        expiryMonth: paymentMethod.card!.exp_month,
        expiryYear: paymentMethod.card!.exp_year
      }
    })
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 })
  }
} 