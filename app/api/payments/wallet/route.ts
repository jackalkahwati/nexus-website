import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Wallet, PaymentDetails } from '@/types/payment'

// Mock database
let wallets: Wallet[] = [
  {
    id: 'w_1',
    customerId: 'mock_customer_id',
    balance: 100,
    currency: 'USD',
    isActive: true,
    lastTransaction: 'tx_1',
  },
]

let transactions: PaymentDetails[] = []

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const customerId = searchParams.get('customerId') || 'mock_customer_id'

  const wallet = wallets.find(w => w.customerId === customerId)
  if (!wallet) {
    return NextResponse.json(
      { error: 'Wallet not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(wallet)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, currency } = body

    if (!customerId || !currency) {
      return NextResponse.json(
        { error: 'Customer ID and currency are required' },
        { status: 400 }
      )
    }

    // Check if wallet already exists
    const existingWallet = wallets.find(w => w.customerId === customerId)
    if (existingWallet) {
      return NextResponse.json(
        { error: 'Wallet already exists for this customer' },
        { status: 400 }
      )
    }

    // Create new wallet
    const wallet: Wallet = {
      id: `w_${Date.now()}`,
      customerId,
      balance: 0,
      currency,
      isActive: true,
    }

    wallets.push(wallet)

    return NextResponse.json(wallet)
  } catch (error) {
    console.error('Error creating wallet:', error)
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    )
  }
}

// Top up wallet
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, amount, paymentMethodId } = body

    if (!customerId || !amount || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Customer ID, amount, and payment method ID are required' },
        { status: 400 }
      )
    }

    const wallet = wallets.find(w => w.customerId === customerId)
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    if (!wallet.isActive) {
      return NextResponse.json(
        { error: 'Wallet is inactive' },
        { status: 400 }
      )
    }

    // Process the top-up payment
    const payment: PaymentDetails = {
      id: `tx_${Date.now()}`,
      amount,
      currency: wallet.currency,
      status: 'completed',
      method: 'credit_card', // This would come from the payment method
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Wallet top-up',
    }

    // Update wallet balance
    wallet.balance += amount
    wallet.lastTransaction = payment.id

    transactions.push(payment)

    return NextResponse.json({
      wallet,
      payment,
    })
  } catch (error) {
    console.error('Error processing top-up:', error)
    return NextResponse.json(
      { error: 'Failed to process top-up' },
      { status: 500 }
    )
  }
} 