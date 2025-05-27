import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { env } from '@/config/env';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return new NextResponse('No signature', { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      env.stripe.webhookSecret!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await prisma.payment.update({
          where: { paymentIntentId: paymentIntent.id },
          data: {
            status: 'succeeded',
            paidAt: new Date(),
          },
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await prisma.payment.update({
          where: { paymentIntentId: failedPayment.id },
          data: {
            status: 'failed',
            error: failedPayment.last_payment_error?.message,
          },
        });
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object;
        await prisma.subscription.create({
          data: {
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripeCustomer: {
              connect: {
                stripeCustomerId: subscription.customer as string,
              },
            },
          },
        });
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        await prisma.subscription.update({
          where: { stripeSubscriptionId: updatedSubscription.id },
          data: {
            status: updatedSubscription.status,
            currentPeriodStart: new Date(updatedSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
          },
        });
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await prisma.subscription.update({
          where: { stripeSubscriptionId: deletedSubscription.id },
          data: {
            status: 'canceled',
            canceledAt: new Date(),
          },
        });
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        if (invoice.subscription) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: {
              status: 'active',
              lastPaymentStatus: 'succeeded',
              lastPaymentDate: new Date(),
            },
          });
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        if (failedInvoice.subscription) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: failedInvoice.subscription as string },
            data: {
              status: 'past_due',
              lastPaymentStatus: 'failed',
              lastPaymentError: failedInvoice.collection_method === 'charge_automatically' ? 
                'Automatic payment failed' : 'Manual payment required',
            },
          });
        }
        break;
    }

    return new NextResponse('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse(
      'Webhook error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 400 }
    );
  }
} 