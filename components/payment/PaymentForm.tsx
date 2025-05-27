'use client'

import React, { useState, useContext } from 'react'
import { usePayment } from '../../contexts/PaymentContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardElement } from '@stripe/react-stripe-js'

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe('pk_test_51Q2epyIozo0uWqRSrEkcoIBnj46p9DCtr9mvBl0x6CB9IFvn4mZbY3ac5TUuN8I7xsA8Y2GRS7rf7oy2StYTKCkC000x1mXd35')

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  // Add more countries as needed
]

function PaymentFormContent() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [amount, setAmount] = React.useState('')
  const [billingDetails, setBillingDetails] = React.useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  })
  const { processPayment } = usePayment()
  const { toast } = useToast()
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  // --- TEMPORARILY COMMENTED OUT --- >
  /*
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card details not found.")
      setIsLoading(false)
      return
    }

    // Example: Replace with actual amount and currency logic
    const amount = 1000 // Example amount in cents
    const currency = 'usd'

    try {
      // Use the tentatively named function
      const paymentResult = await processPayment({ amount, currency, cardElement })

      if (paymentResult.error) {
        setError(paymentResult.error.message || 'An unexpected error occurred')
        toast({ variant: "destructive", title: "Payment Failed", description: paymentResult.error.message })
      } else {
        // Payment succeeded
        console.log('Payment successful:', paymentResult)
        toast({ title: "Payment Successful", description: "Your payment has been processed." })
        // Handle successful payment (e.g., redirect, show success message)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment')
      toast({ variant: "destructive", title: "Error", description: err.message || "An unknown error occurred." })
    } finally {
      setIsLoading(false)
    }
  }
  */
  // <--- END TEMPORARY COMMENT OUT ---

  // Provide a dummy handler to avoid breaking the form submission prop
  const dummySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.warn("Payment form submission temporarily disabled.")
    toast({ title: "Info", description: "Payment submission is currently disabled." })
  }

  const handleBillingChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      if (parent === 'address') {
        setBillingDetails(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }))
      }
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={dummySubmit}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Billing Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={billingDetails.name}
                    onChange={(e) => handleBillingChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingDetails.email}
                    onChange={(e) => handleBillingChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={billingDetails.address.line1}
                  onChange={(e) => handleBillingChange('address.line1', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingDetails.address.city}
                    onChange={(e) => handleBillingChange('address.city', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    value={billingDetails.address.state}
                    onChange={(e) => handleBillingChange('address.state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={billingDetails.address.postal_code}
                    onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={billingDetails.address.country}
                    onValueChange={(value) => handleBillingChange('address.country', value)}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Payment Method</h3>
              <div className="grid gap-2">
                <Label htmlFor="card-element">Card Details</Label>
                <div className="p-3 border rounded">
                  <CardElement id="card-element" options={{style: { /* styling */ }}} />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={isLoading || !stripe || !elements}>
              {isLoading ? 'Processing...' : 'Pay Now'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

export function PaymentForm() {
  const [clientSecret, setClientSecret] = React.useState('')

  React.useEffect(() => {
    // Fetch payment intent client secret
    fetch('/api/payments/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }), // Minimum amount for setup
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error('Error fetching client secret:', error))
  }, [])

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  }

  return (
    <div className="max-w-md mx-auto">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentFormContent />
        </Elements>
      )}
    </div>
  )
}
