"use client"

import React, { createContext, useContext, useState } from 'react'

interface PaymentContextType {
  isProcessing: boolean
  error: string | null
  processPayment: (amount: number, currency: string) => Promise<void>
  clearError: () => void
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async (amount: number, currency: string) => {
    try {
      setIsProcessing(true)
      setError(null)
      // Implement your payment processing logic here
      console.log('Processing payment:', { amount, currency })
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <PaymentContext.Provider value={{ isProcessing, error, processPayment, clearError }}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}
