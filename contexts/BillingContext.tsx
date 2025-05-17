"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { BillingInfo, Plan, PLANS } from "@/types/billing"

interface BillingContextType {
  billingInfo: BillingInfo | null
  isLoading: boolean
  currentPlan: Plan | null
  updateSubscription: (priceId: string) => Promise<void>
  cancelSubscription: () => Promise<void>
  updatePaymentMethod: (paymentMethodId: string) => Promise<void>
}

const BillingContext = createContext<BillingContextType | undefined>(undefined)

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const currentPlan = billingInfo?.subscription
    ? PLANS.find(plan => plan.id === billingInfo.subscription?.planId) || null
    : null

  useEffect(() => {
    fetchBillingInfo()
  }, [])

  const fetchBillingInfo = async () => {
    try {
      const response = await fetch('/api/billing/info')
      const data = await response.json()
      setBillingInfo(data)
    } catch (error) {
      console.error('Failed to fetch billing info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSubscription = async (priceId: string) => {
    try {
      const response = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })
      
      if (!response.ok) throw new Error('Failed to update subscription')
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        await fetchBillingInfo()
      }
    } catch (error) {
      console.error('Failed to update subscription:', error)
      throw error
    }
  }

  const cancelSubscription = async () => {
    try {
      const response = await fetch('/api/billing/subscription', {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to cancel subscription')
      
      await fetchBillingInfo()
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      throw error
    }
  }

  const updatePaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await fetch('/api/billing/payment-method', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId })
      })
      
      if (!response.ok) throw new Error('Failed to update payment method')
      
      await fetchBillingInfo()
    } catch (error) {
      console.error('Failed to update payment method:', error)
      throw error
    }
  }

  return (
    <BillingContext.Provider
      value={{
        billingInfo,
        isLoading,
        currentPlan,
        updateSubscription,
        cancelSubscription,
        updatePaymentMethod
      }}
    >
      {children}
    </BillingContext.Provider>
  )
}

export function useBilling() {
  const context = useContext(BillingContext)
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider')
  }
  return context
} 