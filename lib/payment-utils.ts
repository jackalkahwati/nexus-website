import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, any> = {}
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Failed to create payment intent:', error)
    throw error
  }
}

export async function processRefund(
  paymentIntentId: string,
  amount: number,
  reason: string
): Promise<Stripe.Refund> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount, // Amount in cents
      reason: 'requested_by_customer',
      metadata: {
        reason,
      },
    })

    return refund
  } catch (error) {
    console.error('Failed to process refund:', error)
    throw error
  }
}

export async function createCustomer(
  email: string,
  name?: string,
  metadata: Record<string, any> = {}
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    })

    return customer
  } catch (error) {
    console.error('Failed to create customer:', error)
    throw error
  }
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata: Record<string, any> = {}
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    return subscription
  } catch (error) {
    console.error('Failed to create subscription:', error)
    throw error
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !immediately,
    })

    if (immediately) {
      await stripe.subscriptions.cancel(subscriptionId)
    }

    return subscription
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    throw error
  }
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Stripe.SubscriptionUpdateParams>
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      updates
    )

    return subscription
  } catch (error) {
    console.error('Failed to update subscription:', error)
    throw error
  }
}

export async function retrievePaymentMethod(
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    return paymentMethod
  } catch (error) {
    console.error('Failed to retrieve payment method:', error)
    throw error
  }
}

export async function attachPaymentMethodToCustomer(
  paymentMethodId: string,
  customerId: string
): Promise<Stripe.PaymentMethod> {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })
    return paymentMethod
  } catch (error) {
    console.error('Failed to attach payment method to customer:', error)
    throw error
  }
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })
    return customer
  } catch (error) {
    console.error('Failed to set default payment method:', error)
    throw error
  }
} 