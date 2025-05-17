"use client"

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from "@/components/ui/card"
import { PaymentSettings } from '@/components/payment/PaymentSettings'
import { PaymentHistory } from '@/components/payment/PaymentHistory'
import { PaymentForm } from '@/components/payment/PaymentForm'

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Payments & Billing</h1>
      
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <PaymentSettings />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <PaymentHistory />
          </Card>
        </TabsContent>
        
        <TabsContent value="methods">
          <Card>
            <PaymentForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 