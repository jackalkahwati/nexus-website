"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter,
  ArrowUpDown,
  ChevronDown
} from "lucide-react"

// Transaction Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const colors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800"
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Transaction Type Badge Component
function TypeBadge({ type }: { type: string }) {
  const colors = {
    rental: "bg-blue-100 text-blue-800",
    refund: "bg-purple-100 text-purple-800",
    deposit: "bg-indigo-100 text-indigo-800",
    fee: "bg-orange-100 text-orange-800"
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}

// Transaction List Component
function TransactionList() {
  const transactions = [
    {
      id: "TX123456",
      date: "2024-02-03",
      type: "rental",
      amount: 150.00,
      customer: "John Doe",
      vehicle: "Tesla Model 3",
      status: "completed"
    },
    {
      id: "TX123457",
      date: "2024-02-03",
      type: "deposit",
      amount: 500.00,
      customer: "Jane Smith",
      vehicle: "BMW X5",
      status: "pending"
    },
    {
      id: "TX123458",
      date: "2024-02-02",
      type: "refund",
      amount: -75.00,
      customer: "Mike Johnson",
      vehicle: "Ford Transit",
      status: "completed"
    },
    {
      id: "TX123459",
      date: "2024-02-02",
      type: "fee",
      amount: 25.00,
      customer: "Sarah Wilson",
      vehicle: "Tesla Model 3",
      status: "failed"
    }
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(transaction => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.id}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>
              <TypeBadge type={transaction.type} />
            </TableCell>
            <TableCell className={transaction.amount < 0 ? "text-red-600" : "text-green-600"}>
              ${Math.abs(transaction.amount).toFixed(2)}
            </TableCell>
            <TableCell>{transaction.customer}</TableCell>
            <TableCell>{transaction.vehicle}</TableCell>
            <TableCell>
              <StatusBadge status={transaction.status} />
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">View Details</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Summary Cards Component
function SummaryCards() {
  const summaries = [
    {
      title: "Total Revenue",
      amount: "$12,450.00",
      change: "+12.5%",
      period: "vs. last month"
    },
    {
      title: "Pending Payments",
      amount: "$1,250.00",
      count: "5 transactions",
      status: "pending"
    },
    {
      title: "Refunds",
      amount: "$350.00",
      count: "2 transactions",
      status: "refunded"
    },
    {
      title: "Failed Payments",
      amount: "$750.00",
      count: "3 transactions",
      status: "failed"
    }
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {summaries.map((summary, index) => (
        <Card key={index} className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground">{summary.title}</h3>
          <p className="text-2xl font-bold mt-2">{summary.amount}</p>
          <div className="mt-2">
            {summary.change ? (
              <span className={`text-sm ${
                summary.change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}>
                {summary.change} {summary.period}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                {summary.count}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

// Filter Bar Component
function FilterBar() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            type="search"
          />
        </div>
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="rental">Rental</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="refund">Refund</SelectItem>
          <SelectItem value="fee">Fee</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        More Filters
      </Button>
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  )
}

export default function PaymentHistoryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Fleet Payment History</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <SummaryCards />
        
        <Card className="p-6">
          <div className="space-y-4">
            <FilterBar />
            <Separator />
            <TransactionList />
          </div>
        </Card>
      </div>
    </div>
  )
} 