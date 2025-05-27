import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { PaymentIntent } from '@/types/payment'

// Mock database
let paymentIntents: PaymentIntent[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description } = body

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      )
    }

    // In a real app, this would create a payment intent with Stripe or another payment processor
    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'pending',
      customerId: 'mock_customer_id', // This would come from the authenticated user
      description,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // Expires in 1 hour
    }

    paymentIntents.push(paymentIntent)

    return NextResponse.json(paymentIntent)
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const customerId = searchParams.get('customerId')
  const status = searchParams.get('status')

  let filteredIntents = [...paymentIntents]

  if (customerId) {
    filteredIntents = filteredIntents.filter(
      intent => intent.customerId === customerId
    )
  }

  if (status) {
    filteredIntents = filteredIntents.filter(
      intent => intent.status === status
    )
  }

  return NextResponse.json({
    paymentIntents: filteredIntents,
    total: filteredIntents.length,
  })
} 