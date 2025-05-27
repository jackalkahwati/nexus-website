import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Transaction } from '@/types/payment'

// Mock database
let transactions: Transaction[] = [
  {
    id: 'tx_1',
    paymentId: 'pay_1',
    type: 'charge',
    amount: 100,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-01-15T00:00:00Z',
    fee: 2.5,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let filteredTransactions = [...transactions]

  if (type) {
    filteredTransactions = filteredTransactions.filter(
      transaction => transaction.type === type
    )
  }

  if (status) {
    filteredTransactions = filteredTransactions.filter(
      transaction => transaction.status === status
    )
  }

  if (from) {
    filteredTransactions = filteredTransactions.filter(
      transaction => new Date(transaction.createdAt) >= new Date(from)
    )
  }

  if (to) {
    filteredTransactions = filteredTransactions.filter(
      transaction => new Date(transaction.createdAt) <= new Date(to)
    )
  }

  // Sort by created date descending
  filteredTransactions.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return NextResponse.json(filteredTransactions)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, type, amount, currency } = body

    if (!paymentId || !type || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      paymentId,
      type,
      amount,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
      fee: type === 'charge' ? amount * 0.025 : 0, // 2.5% fee for charges
    }

    transactions.push(transaction)

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
} 