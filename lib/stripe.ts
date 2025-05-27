import Stripe from 'stripe'
import { env } from '@/env.mjs'
import { prisma } from './prisma'
import { PaymentIntent, CurrencyCode } from '../types/payment'

if (!env.stripe.secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

interface CreatePaymentIntentParams {
  amount: number
  currency: CurrencyCode
  customerId: string
  description?: string
  metadata?: Record<string, any>
  paymentMethodId?: string
}

export async function createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
  const {
    amount,
    currency,
    customerId,
    description,
    metadata,
    paymentMethodId
  } = params

  const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    customer: customerId,
    description,
    metadata,
    payment_method: paymentMethodId,
    confirmation_method: 'automatic',
    confirm: paymentMethodId ? true : false,
    automatic_payment_methods: paymentMethodId ? undefined : {
      enabled: true,
      allow_redirects: 'never'
    }
  }

  const intent = await stripe.paymentIntents.create(paymentIntentParams)

  // Map Stripe PaymentIntent to our PaymentIntent type
  return {
    id: intent.id,
    amount: intent.amount / 100, // Convert back to dollars
    currency: intent.currency.toUpperCase() as CurrencyCode,
    status: mapStripeStatus(intent.status),
    customerId,
    paymentMethodId: intent.payment_method as string | undefined,
    description: intent.description || undefined,
    metadata: intent.metadata,
    createdAt: new Date(intent.created * 1000).toISOString(),
    expiresAt: new Date(intent.created * 1000 + 24 * 60 * 60 * 1000).toISOString(), // 24 hours expiry
    canceledAt: intent.canceled_at 
      ? new Date(intent.canceled_at * 1000).toISOString()
      : undefined,
    capturedAt: intent.latest_charge
      ? new Date(intent.created * 1000).toISOString()
      : undefined
  }
}

function mapStripeStatus(status: Stripe.PaymentIntent.Status): PaymentIntent['status'] {
  switch (status) {
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return 'pending'
    case 'processing':
      return 'processing'
    case 'succeeded':
      return 'completed'
    case 'canceled':
      return 'failed'
    default:
      return 'pending'
  }
}

export async function createOrRetrieveCustomer(userId: string, email: string) {
  const customer = await prisma.stripeCustomer.findUnique({
    where: { userId },
  })

  if (customer) {
    return customer.stripeCustomerId
  }

  const stripeCustomer = await stripe.customers.create({
    email,
    metadata: {
      userId
    }
  })

  await prisma.stripeCustomer.create({
    data: {
      userId,
      stripeCustomerId: stripeCustomer.id,
    },
  })

  return stripeCustomer.id
}

export async function getCustomerSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    status: 'active',
    expand: ['data.default_payment_method']
  })

  return subscriptions.data[0]
}

export async function createStripeAccount(email: string) {
  try {
    const account = await stripe.accounts.create({
      type: 'standard',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
    return account
  } catch (error) {
    console.error('Error creating Stripe account:', error)
    throw error
  }
}

export async function createCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })
    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

export async function attachPaymentMethod(customerId: string, paymentMethodId: string) {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })
    return paymentMethod
  } catch (error) {
    console.error('Error attaching payment method:', error)
    throw error
  }
}
