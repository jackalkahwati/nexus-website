export type PlanInterval = 'month' | 'year'

export interface Plan {
  id: string
  name: string
  description: string
  features: string[]
  price: number
  interval: PlanInterval
  stripePriceId: string
}

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  currentPeriodEnd: string
  planId: string
  stripeSubscriptionId: string
  cancelAtPeriodEnd: boolean
}

export interface BillingInfo {
  subscription: Subscription | null
  paymentMethod: {
    brand: string
    last4: string
    expiryMonth: number
    expiryYear: number
  } | null
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small fleets and startups',
    features: [
      'Up to 50 vehicles',
      'Basic analytics',
      'Email support',
      'API access',
      'Real-time tracking'
    ],
    price: 99,
    interval: 'month',
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing fleets with advanced needs',
    features: [
      'Up to 200 vehicles',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Fleet optimization tools',
      'Maintenance scheduling'
    ],
    price: 299,
    interval: 'month',
    stripePriceId: 'price_professional_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large fleets requiring full control',
    features: [
      'Unlimited vehicles',
      'Custom analytics',
      '24/7 dedicated support',
      'White-label options',
      'Advanced security features',
      'SLA guarantees',
      'Custom development'
    ],
    price: 999,
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly'
  }
] 