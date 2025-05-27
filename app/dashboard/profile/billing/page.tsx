"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useBilling } from "@/contexts/BillingContext"
import { PLANS } from "@/types/billing"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BillingPage() {
  const { billingInfo, isLoading, currentPlan, updateSubscription, cancelSubscription } = useBilling()
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month')
  const [isCanceling, setIsCanceling] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateSubscription = async (priceId: string) => {
    try {
      setIsUpdating(true)
      await updateSubscription(priceId)
    } catch (error) {
      console.error('Failed to update subscription:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setIsCanceling(true)
      await cancelSubscription()
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
    } finally {
      setIsCanceling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {billingInfo?.subscription ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{currentPlan?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${currentPlan?.price}/month
                  </p>
                </div>
                <Badge variant={billingInfo.subscription.status === 'active' ? 'default' : 'destructive'}>
                  {billingInfo.subscription.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Next billing date: {new Date(billingInfo.subscription.currentPeriodEnd).toLocaleDateString()}
              </div>
              {billingInfo.subscription.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  Your subscription will be canceled at the end of the current period
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription</p>
          )}
        </CardContent>
        {billingInfo?.subscription && (
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isCanceling}>
                  {isCanceling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Subscription</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancelSubscription}>
                    Yes, cancel my subscription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <Card key={plan.id} className="relative">
                {currentPlan?.id === plan.id && (
                  <div className="absolute -top-2 -right-2">
                    <Badge>Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-base font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={currentPlan?.id === plan.id || isUpdating}
                    onClick={() => handleUpdateSubscription(plan.stripePriceId)}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : currentPlan?.id === plan.id ? (
                      'Current Plan'
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingInfo?.paymentMethod ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <p className="font-medium">
                    {billingInfo.paymentMethod.brand.toUpperCase()} ****{billingInfo.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          ) : (
            <Button>Add Payment Method</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 