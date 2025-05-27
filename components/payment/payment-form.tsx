"use client"

import { useState } from 'react'
import { usePayment } from '@/contexts/PaymentContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

interface PaymentFormProps {
  amount?: number
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function PaymentFormContent({ amount: initialAmount, onSuccess, onError }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState(initialAmount || 0)
  const { createPayment } = usePayment()
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    try {
      setIsLoading(true)

      // Create payment intent
      const { clientSecret } = await createPayment(amount)

      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/payments/success`,
        },
        redirect: 'if_required',
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (paymentIntent?.status === 'succeeded') {
        toast({
          title: 'Payment successful',
          description: `Payment of $${amount} was processed successfully.`,
        })
        onSuccess?.()
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
      onError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!initialAmount && (
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="pl-7"
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="rounded-md border p-4">
          <PaymentElement />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements || amount <= 0}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay ${amount.toFixed(2)}</>
        )}
      </Button>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  )
} 