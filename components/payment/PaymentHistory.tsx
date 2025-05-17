'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format, isValid, parseISO } from 'date-fns'
import { DollarSign, AlertCircle } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  description: string
  paymentMethod: string
}

export function PaymentHistory() {
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/payments')
        if (!response.ok) throw new Error('Failed to fetch payments')
        const data = await response.json()
        setPayments(data.payments || [])
      } catch (error) {
        console.error('Error fetching payments:', error)
        setError('Failed to load payment history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      if (!isValid(date)) {
        return 'Invalid date'
      }
      return format(date, 'MMM d, yyyy')
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium">No payment history</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your payment history will appear here once you start making transactions
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View all your past transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === 'completed'
                        ? 'default'
                        : payment.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${payment.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </>
  )
} 