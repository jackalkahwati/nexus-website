import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Mock payment methods data
const mockPaymentMethods = [
  {
    id: 'pm_mock_1',
    type: 'credit_card',
    isDefault: true,
    lastFour: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    holderName: 'John Doe',
    billingAddress: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US'
    }
  },
  {
    id: 'pm_mock_2',
    type: 'credit_card',
    isDefault: false,
    lastFour: '8888',
    expiryMonth: 3,
    expiryYear: 2024,
    holderName: 'John Doe',
    billingAddress: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US'
    }
  },
  {
    id: 'pm_mock_3',
    type: 'bank_transfer',
    isDefault: false,
    lastFour: '6789',
    holderName: 'John Doe',
    billingAddress: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US'
    }
  }
]

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Return mock payment methods
    return NextResponse.json({ paymentMethods: mockPaymentMethods })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { type, billingAddress } = body

    // Mock adding a payment method
    const newMethod = {
      id: `pm_mock_${Date.now()}`,
      type: type || 'credit_card',
      isDefault: false,
      lastFour: '1234',
      expiryMonth: 12,
      expiryYear: 2025,
      holderName: session.user.name || 'Unknown',
      billingAddress: billingAddress || {
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US'
      }
    }

    return NextResponse.json({ paymentMethod: newMethod })
  } catch (error) {
    console.error('Error adding payment method:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const paymentMethodId = searchParams.get('id')

    if (!paymentMethodId) {
      return new NextResponse('Payment method ID required', { status: 400 })
    }

    // Mock removing a payment method
    return new NextResponse('Payment method removed', { status: 200 })
  } catch (error) {
    console.error('Error removing payment method:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const methodId = searchParams.get('id')

    if (!methodId) {
      return new NextResponse('Payment method ID required', { status: 400 })
    }

    // Mock updating default payment method
    const updatedMethods = mockPaymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    }))

    return NextResponse.json({ paymentMethods: updatedMethods })
  } catch (error) {
    console.error('Error updating default payment method:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 