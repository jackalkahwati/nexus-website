import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return new NextResponse('Invalid amount', { status: 400 })
    }

    // Get or create Stripe customer
    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { userId: session.user.id },
    })

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          userId: session.user.id,
        },
      })

      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          userId: session.user.id,
          stripeCustomerId: customer.id,
        },
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: stripeCustomer.stripeCustomerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return new NextResponse(
      'Error creating payment intent: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
