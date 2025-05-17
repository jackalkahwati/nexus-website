import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe, createOrRetrieveCustomer } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Mock payment data
const mockPayments = [
  {
    id: 'pay_mock_1',
    amount: 299.99,
    currency: 'USD',
    status: 'completed',
    description: 'Monthly Subscription - Premium Plan',
    createdAt: '2024-02-01T10:00:00Z',
    method: 'credit_card',
    metadata: {
      last4: '4242',
      brand: 'Visa',
      expMonth: 12,
      expYear: 2025
    },
    billingDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        line1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'US'
      }
    }
  },
  {
    id: 'pay_mock_2',
    amount: 499.99,
    currency: 'USD',
    status: 'processing',
    description: 'Hardware Purchase - Vehicle Tracker',
    createdAt: '2024-01-28T15:30:00Z',
    method: 'bank_transfer',
    metadata: {
      bankName: 'Chase',
      last4: '6789',
      type: 'checking'
    },
    billingDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        line1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'US'
      }
    }
  },
  {
    id: 'pay_mock_3',
    amount: 149.99,
    currency: 'USD',
    status: 'completed',
    description: 'Additional User Licenses (5)',
    createdAt: '2024-01-25T09:15:00Z',
    method: 'wallet',
    metadata: {
      walletType: 'Apple Pay'
    },
    billingDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        line1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'US'
      }
    }
  },
  {
    id: 'pay_mock_4',
    amount: 99.99,
    currency: 'USD',
    status: 'failed',
    description: 'API Access - Developer Plan',
    createdAt: '2024-01-20T14:45:00Z',
    method: 'credit_card',
    metadata: {
      last4: '8888',
      brand: 'Mastercard',
      expMonth: 3,
      expYear: 2024,
      error: 'Insufficient funds'
    },
    billingDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        line1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'US'
      }
    }
  }
]

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Return mock payments data
    return NextResponse.json({ payments: mockPayments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { amount, currency = 'USD', description, paymentMethod } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Mock successful payment creation
    const payment = {
      id: `pay_mock_${Date.now()}`,
      amount,
      currency,
      status: 'completed',
      description: description || 'Payment',
      createdAt: new Date().toISOString(),
      method: paymentMethod?.type || 'credit_card',
      metadata: paymentMethod,
      billingDetails: {
        name: session.user.name,
        email: session.user.email,
        address: body.billingAddress || {}
      }
    };

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 