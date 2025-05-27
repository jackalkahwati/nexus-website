import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import type { PaymentIntent, CurrencyCode } from '@/types/payment';

interface User {
  id: string;
  email: string | null;
  name: string | null;
}

export class PaymentService {
  async createPaymentIntent(
    amount: number,
    currency: CurrencyCode,
    userId: string,
    email: string
  ): Promise<PaymentIntent> {
    const customerId = await this.createOrRetrieveCustomer(userId, email);

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase() as Lowercase<CurrencyCode>,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    return {
      id: intent.id,
      amount: intent.amount / 100,
      currency: intent.currency.toUpperCase() as CurrencyCode,
      status: this.mapStripeStatus(intent.status),
      customerId,
      paymentMethodId: intent.payment_method as string | undefined,
      description: intent.description || undefined,
      metadata: intent.metadata,
      createdAt: new Date(intent.created * 1000).toISOString(),
      expiresAt: new Date(intent.created * 1000 + 24 * 60 * 60 * 1000).toISOString(),
      canceledAt: intent.canceled_at 
        ? new Date(intent.canceled_at * 1000).toISOString() 
        : undefined,
      capturedAt: intent.latest_charge
        ? new Date(intent.created * 1000).toISOString()
        : undefined
    };
  }

  private mapStripeStatus(status: string): PaymentIntent['status'] {
    switch (status) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'succeeded':
        return 'completed';
      case 'canceled':
        return 'failed';
      default:
        return 'pending';
    }
  }

  private async createOrRetrieveCustomer(userId: string, email: string): Promise<string> {
    const existingCustomer = await prisma.stripeCustomer.findUnique({
      where: { userId }
    });

    if (existingCustomer) {
      return existingCustomer.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email,
      metadata: { userId }
    });

    await prisma.stripeCustomer.create({
      data: {
        stripeCustomerId: customer.id,
        userId
      }
    });

    return customer.id;
  }

  async createPayment({
    amount,
    currency = 'usd',
    user,
  }: {
    amount: number;
    currency?: string;
    user: User;
  }) {
    const customerId = await this.createOrRetrieveCustomer(user.id, user.email || '');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    const payment = await prisma.payment.create({
      data: {
        amount,
        currency,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        userId: user.id,
      },
    });

    return {
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async getUserPayments(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPaymentStatus(paymentIntentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { paymentIntentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment.status;
  }

  async createSubscription({
    priceId,
    user,
  }: {
    priceId: string;
    user: User;
  }) {
    const customerId = await this.createOrRetrieveCustomer(user.id, user.email || '');

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCustomerId: customerId,
      },
    });

    return subscription;
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      },
    });

    return subscription;
  }

  async getUserSubscriptions(userId: string) {
    const stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { userId },
      include: { subscriptions: true },
    });

    return stripeCustomer?.subscriptions || [];
  }
} 