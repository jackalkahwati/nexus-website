import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return new NextResponse('No signature', { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Update rental status and record payment
        await prisma.payment.create({
          data: {
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded',
            stripePaymentIntentId: paymentIntent.id,
            metadata: paymentIntent.metadata,
          },
        })
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        // Handle failed payment
        await prisma.payment.create({
          data: {
            amount: failedPayment.amount,
            currency: failedPayment.currency,
            status: 'failed',
            stripePaymentIntentId: failedPayment.id,
            metadata: failedPayment.metadata,
          },
        })
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          create: {
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            customerId: subscription.customer as string,
          },
          update: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await prisma.subscription.update({
          where: { stripeSubscriptionId: deletedSubscription.id },
          data: { status: 'canceled' },
        })
        break
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new NextResponse('Webhook error', { status: 400 })
  }
}
