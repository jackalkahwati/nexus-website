import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Invoice } from '@/types/payment'

// Mock database
let invoices: Invoice[] = [
  {
    id: 'inv_1',
    number: 'INV-2024-001',
    customerId: 'mock_customer_id',
    amount: 150,
    currency: 'USD',
    status: 'paid',
    dueDate: '2024-02-15T00:00:00Z',
    issuedDate: '2024-01-15T00:00:00Z',
    paidDate: '2024-01-16T00:00:00Z',
    items: [
      {
        id: 'item_1',
        description: 'Fleet Management Service - Basic Plan',
        quantity: 1,
        unitPrice: 100,
        amount: 100,
      },
      {
        id: 'item_2',
        description: 'Additional Vehicle Tracking',
        quantity: 2,
        unitPrice: 25,
        amount: 50,
      },
    ],
    subtotal: 150,
    tax: 0,
    total: 150,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const customerId = searchParams.get('customerId')
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let filteredInvoices = [...invoices]

  if (customerId) {
    filteredInvoices = filteredInvoices.filter(
      invoice => invoice.customerId === customerId
    )
  }

  if (status) {
    filteredInvoices = filteredInvoices.filter(
      invoice => invoice.status === status
    )
  }

  if (from) {
    filteredInvoices = filteredInvoices.filter(
      invoice => new Date(invoice.issuedDate) >= new Date(from)
    )
  }

  if (to) {
    filteredInvoices = filteredInvoices.filter(
      invoice => new Date(invoice.issuedDate) <= new Date(to)
    )
  }

  // Sort by issued date descending
  filteredInvoices.sort((a, b) =>
    new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
  )

  return NextResponse.json({
    invoices: filteredInvoices,
    total: filteredInvoices.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, items, dueDate, notes } = body

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer ID and at least one item are required' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = 0 // In a real app, this would be calculated based on tax rules

    // Create new invoice
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      customerId,
      amount: subtotal + tax,
      currency: 'USD', // This would be configurable in a real app
      status: 'draft',
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
      issuedDate: new Date().toISOString(),
      items: items.map((item, index) => ({
        id: `item_${Date.now()}_${index}`,
        ...item,
      })),
      subtotal,
      tax,
      total: subtotal + tax,
      notes,
    }

    invoices.push(invoice)

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
} 