"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Clock,
  Timer,
  Truck,
  MapPin,
  Calendar,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  RefreshCw,
} from "lucide-react"
import { DeliveryMap } from "@/components/maps/DeliveryMap"

interface Delivery {
  id: string
  orderId: string
  address: string
  coordinates: [number, number]
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'failed'
  priority: 'normal' | 'high' | 'urgent'
  estimatedTime: string
  actualTime?: string
  driver: string
  customer: string
  items: number
  distance: number
  notes?: string
}

const mockDeliveries: Delivery[] = [
  {
    id: "1",
    orderId: "ORD-001",
    address: "123 Main St, San Francisco, CA",
    coordinates: [-122.4194, 37.7749],
    status: "in_progress",
    priority: "high",
    estimatedTime: "2024-01-10T14:30:00",
    driver: "John Doe",
    customer: "Alice Smith",
    items: 3,
    distance: 2.5,
    notes: "Leave at front door"
  },
  {
    id: "2",
    orderId: "ORD-002",
    address: "456 Market St, San Francisco, CA",
    coordinates: [-122.4037, 37.7901],
    status: "pending",
    priority: "normal",
    estimatedTime: "2024-01-10T15:00:00",
    driver: "Jane Smith",
    customer: "Bob Johnson",
    items: 1,
    distance: 1.8
  },
  {
    id: "3",
    orderId: "ORD-003",
    address: "789 Mission St, San Francisco, CA",
    coordinates: [-122.4089, 37.7850],
    status: "delayed",
    priority: "urgent",
    estimatedTime: "2024-01-10T13:45:00",
    driver: "Mike Wilson",
    customer: "Carol Davis",
    items: 2,
    distance: 3.2,
    notes: "Customer requested evening delivery"
  }
]

export default function ETAPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [priorityFilter, setPriorityFilter] = React.useState("all")
  const [selectedDelivery, setSelectedDelivery] = React.useState<Delivery | null>(null)

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-700 dark:text-green-400'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      case 'delayed':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400'
      case 'failed':
        return 'bg-red-500/20 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: Delivery['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-700 dark:text-red-400'
      case 'high':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400'
      case 'normal':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = 
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    const matchesPriority = priorityFilter === "all" || delivery.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Delivery ETAs</h2>
          <p className="text-muted-foreground">
            Monitor and predict delivery times
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh ETAs
          </Button>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Delivery Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3 min</div>
            <p className="text-xs text-muted-foreground">
              -2.1% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On-Time Deliveries
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Deliveries
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockDeliveries.filter(d => d.priority === 'urgent').length} urgent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delayed Orders
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDeliveries.filter(d => d.status === 'delayed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Deliveries</CardTitle>
                <CardDescription>Track ongoing deliveries and ETAs</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search deliveries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Delivery List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {filteredDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedDelivery?.id === delivery.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{delivery.orderId}</span>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {delivery.address}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Timer className="h-4 w-4 mr-2" />
                        ETA: {format(new Date(delivery.estimatedTime), 'h:mm a')}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Truck className="h-4 w-4 mr-2" />
                        {delivery.driver}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Delivery Map</CardTitle>
            <CardDescription>Live locations and routes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px]">
              <DeliveryMap
                deliveries={filteredDeliveries}
                selectedDelivery={selectedDelivery}
                onSelectDelivery={setSelectedDelivery}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
