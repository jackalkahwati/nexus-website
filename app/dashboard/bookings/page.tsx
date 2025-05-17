"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  Filter,
  Search,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Repeat,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { BookingForm } from "@/components/bookings/BookingForm"
import { useToast } from "@/components/ui/use-toast"

interface Booking {
  id: string
  customerName: string
  type: 'single' | 'recurring' | 'group'
  status: 'confirmed' | 'pending' | 'cancelled'
  startTime: string
  endTime: string
  location: string
  participants?: number
  vehicleType: string
  notes?: string
  recurringPattern?: string
}

const mockBookings: Booking[] = [
  {
    id: "B001",
    customerName: "John Smith",
    type: "single",
    status: "confirmed",
    startTime: "2024-01-10T09:00:00",
    endTime: "2024-01-10T10:00:00",
    location: "Downtown Station",
    vehicleType: "Standard",
    notes: "First-time rider"
  },
  {
    id: "B002",
    customerName: "Corporate Events Inc",
    type: "group",
    status: "pending",
    startTime: "2024-01-11T14:00:00",
    endTime: "2024-01-11T17:00:00",
    location: "Convention Center",
    participants: 15,
    vehicleType: "Premium",
    notes: "Corporate event transportation"
  },
  {
    id: "B003",
    customerName: "Sarah Wilson",
    type: "recurring",
    status: "confirmed",
    startTime: "2024-01-12T08:00:00",
    endTime: "2024-01-12T09:00:00",
    location: "University Campus",
    vehicleType: "Standard",
    recurringPattern: "Every weekday"
  }
]

export default function BookingsPage() {
  const [date, setDate] = React.useState<Date>()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [bookingToDelete, setBookingToDelete] = React.useState<Booking | null>(null)
  const { toast } = useToast()

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-700 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: Booking['type']) => {
    switch (type) {
      case 'recurring':
        return <Repeat className="h-4 w-4" />
      case 'group':
        return <Users className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesType = typeFilter === "all" || booking.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleEditBooking = async (data: any) => {
    try {
      // TODO: Implement actual API call
      console.log('Editing booking:', data)
      toast({
        title: "Booking Updated",
        description: "The booking has been updated successfully.",
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the booking.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBooking = async (booking: Booking) => {
    try {
      // TODO: Implement actual API call
      console.log('Deleting booking:', booking.id)
      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
      setBookingToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the booking.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage reservations and schedules
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
                <DialogDescription>
                  Add a new reservation to the system
                </DialogDescription>
              </DialogHeader>
              <BookingForm 
                onSubmit={async (data) => {
                  console.log(data)
                  // TODO: Implement booking creation
                  // await createBooking(data)
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confirmed Bookings
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBookings.filter(b => b.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for service
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBookings.filter(b => b.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Group Bookings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBookings.filter(b => b.type === 'group').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Special events
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <CardContent className="p-4">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            {getTypeIcon(booking.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {booking.customerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBooking(booking)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setBookingToDelete(booking)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          {format(new Date(booking.startTime), 'PPp')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          {booking.location}
                        </div>
                        {booking.participants && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" />
                            {booking.participants} participants
                          </div>
                        )}
                        {booking.recurringPattern && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Repeat className="mr-2 h-4 w-4" />
                            {booking.recurringPattern}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Booking Calendar</CardTitle>
              <CardDescription>View and manage scheduled bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-4">
                    {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                  </h3>
                  <div className="space-y-4">
                    {/* Add daily schedule view here */}
                    <p className="text-sm text-muted-foreground">
                      Daily schedule view coming soon
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update the booking details
            </DialogDescription>
          </DialogHeader>
          <BookingForm 
            booking={selectedBooking}
            onSubmit={handleEditBooking}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => bookingToDelete && handleDeleteBooking(bookingToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 