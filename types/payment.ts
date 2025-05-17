export type PaymentMethodType = 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet'

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY'

export interface PaymentDetails {
  id: string
  amount: number
  currency: CurrencyCode
  status: PaymentStatus
  method: PaymentMethodType
  createdAt: string
  updatedAt: string
  description?: string
  metadata?: Record<string, any>
  billingDetails: {
    name: string
    email: string
    address: {
      line1: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
}

export interface Transaction {
  id: string
  paymentId: string
  type: 'charge' | 'refund' | 'payout'
  amount: number
  currency: CurrencyCode
  status: PaymentStatus
  createdAt: string
  fee?: number
  error?: string
}

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  isDefault: boolean
  lastFour?: string
  expiryMonth?: number
  expiryYear?: number
  holderName?: string
  billingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface Invoice {
  id: string
  number: string
  customerId: string
  amount: number
  currency: CurrencyCode
  status: 'draft' | 'sent' | 'paid' | 'void' | 'overdue'
  dueDate: string
  issuedDate: string
  paidDate?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  metadata?: Record<string, any>
}

export interface Wallet {
  id: string
  customerId: string
  balance: number
  currency: CurrencyCode
  isActive: boolean
  lastTransaction?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: CurrencyCode
  status: PaymentStatus
  customerId: string
  paymentMethodId?: string
  description?: string
  metadata?: Record<string, any>
  createdAt: string
  expiresAt: string
  canceledAt?: string
  capturedAt?: string
}

export interface Refund {
  id: string
  paymentIntentId: string
  amount: number
  currency: CurrencyCode
  status: 'pending' | 'succeeded' | 'failed'
  reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent'
  createdAt: string
  metadata?: Record<string, any>
} 