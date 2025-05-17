"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Building2,
  Users,
  Car,
  Activity,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

// Usage Stats Component
function UsageStats() {
  const stats = [
    {
      title: "Active Vehicles",
      current: 45,
      limit: 50,
      percentage: 90
    },
    {
      title: "Active Users",
      current: 120,
      limit: 150,
      percentage: 80
    },
    {
      title: "API Calls",
      current: 45000,
      limit: 50000,
      percentage: 90
    },
    {
      title: "Storage Used",
      current: 450,
      limit: 500,
      percentage: 90,
      unit: "GB"
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground">{stat.title}</h3>
          <p className="text-2xl font-bold mt-2">
            {stat.current.toLocaleString()}{stat.unit ? stat.unit : ""}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              of {stat.limit.toLocaleString()}{stat.unit ? stat.unit : ""}
            </span>
          </p>
          <Progress value={stat.percentage} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {stat.percentage}% used
          </p>
        </Card>
      ))}
    </div>
  )
}

// Billing Plan Component
function BillingPlan() {
  const features = [
    "Up to 50 vehicles",
    "Up to 150 users",
    "50,000 API calls/month",
    "500GB storage",
    "24/7 support",
    "Advanced analytics",
    "Custom integrations",
    "Priority support"
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium">Enterprise Plan</h3>
          <p className="text-sm text-muted-foreground">Current billing plan</p>
        </div>
        <Badge variant="secondary" className="text-primary">Active</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-3xl font-bold">$999<span className="text-base font-normal text-muted-foreground">/month</span></p>
          <p className="text-sm text-muted-foreground">Billed annually</p>
        </div>

        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button className="flex-1">Change Plan</Button>
          <Button variant="outline" className="flex-1">Contact Sales</Button>
        </div>
      </div>
    </Card>
  )
}

// Billing History Component
function BillingHistory() {
  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-02-01",
      amount: 999.00,
      status: "paid",
      period: "Feb 2024"
    },
    {
      id: "INV-2024-002",
      date: "2024-01-01",
      amount: 999.00,
      status: "paid",
      period: "Jan 2024"
    },
    {
      id: "INV-2023-012",
      date: "2023-12-01",
      amount: 999.00,
      status: "paid",
      period: "Dec 2023"
    }
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(invoice => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.period}</TableCell>
            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={invoice.status === "paid" ? "success" : "warning"}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Payment Method Component
function PaymentMethod() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium">Payment Method</h3>
          <p className="text-sm text-muted-foreground">Manage your payment details</p>
        </div>
        <Button variant="outline">Update</Button>
      </div>

      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">•••• •••• •••• 4242</p>
          <p className="text-sm text-muted-foreground">Expires 12/2024</p>
        </div>
      </div>
    </Card>
  )
}

export default function PlatformBillingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Building2 className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Platform Billing</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Usage Overview</h2>
            <UsageStats />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Billing History</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
            <BillingHistory />
          </Card>
        </div>

        <div className="space-y-6">
          <BillingPlan />
          <PaymentMethod />
        </div>
      </div>
    </div>
  )
} 