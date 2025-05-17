"use client"

import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import {
  Wrench,
  AlertTriangle,
  Clock,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Settings,
  CheckCircle2,
  AlertCircle,
  Timer,
  DollarSign,
  MoreVertical,
  Pencil,
  Trash2,
  Battery,
  Zap,
  Leaf,
  ThermometerSun,
  Users
} from "lucide-react"
import { useMaintenance } from "@/contexts/MaintenanceContext"
import { MaintenanceStatus, MaintenanceTask, ServicePriority } from "@/types/maintenance"
import { MaintenanceDialog } from "@/components/maintenance/maintenance-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

// Mock charging data - Replace with real API data later
const mockChargingData = {
  totalSessions: 128,
  totalKwh: 2560,
  co2Saved: 1280, // kg
  avgEfficiency: 92, // percentage
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return amount.toFixed(2)
}

export default function MaintenancePage() {
  const {
    tasks,
    isLoading,
    error,
    getUpcomingMaintenance,
    getOverdueMaintenance,
    deleteTask
  } = useMaintenance()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | undefined>()

  // Add new state for charging metrics
  const [showChargingMetrics, setShowChargingMetrics] = useState(true)

  const tasksByType = useMemo(() => ({
    all: tasks || [],
    preventive: tasks?.filter(task => task.type === 'preventive') || [],
    charging: tasks?.filter(task => task.type === 'charging') || [],
    battery: tasks?.filter(task => task.type === 'battery') || []
  }), [tasks])

  const handleEditTask = (task: MaintenanceTask) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(undefined)
    setDialogOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Wrench className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Loading maintenance data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4 text-destructive">
          <AlertTriangle className="h-8 w-8" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const totalCost = tasks?.reduce((sum, task) => sum + (task.cost || 0), 0) || 0
  const averageDuration = tasks?.length > 0
    ? tasks.reduce((sum, task) => sum + task.estimatedDuration, 0) / tasks.length
    : 0

  const renderTaskList = (tasks: MaintenanceTask[]) => (
    <div className="grid gap-4">
      {tasks.map(task => (
        <Card key={task.id}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                  {task.type === 'charging' && (
                    <Badge variant="secondary">
                      <Zap className="mr-1 h-3 w-3" />
                      Charging
                    </Badge>
                  )}
                  {task.type === 'battery' && (
                    <Badge variant="secondary">
                      <Battery className="mr-1 h-3 w-3" />
                      Battery
                    </Badge>
                  )}
                  {task.type === 'preventive' && (
                    <Badge variant="secondary">
                      <Wrench className="mr-1 h-3 w-3" />
                      Preventive
                    </Badge>
                  )}
                </div>
                <CardDescription>{task.description}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={task.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {new Date(task.scheduledDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Timer className="mr-1 h-4 w-4" />
                {task.estimatedDuration} min
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4" />
                ${formatCurrency(task.cost || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {tasks.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          No tasks found
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Maintenance & Service</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button onClick={handleCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksByType.all.filter(task => task.status === 'overdue').length}</div>
              <p className="text-xs text-muted-foreground">
                {tasksByType.all.filter(task => task.status === 'overdue').length > 0 ? 'Requires immediate attention' : 'No overdue tasks'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksByType.all.filter(task => task.status === 'in_progress').length}</div>
              <p className="text-xs text-muted-foreground">
                Tasks currently being worked on
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksByType.all.filter(task => task.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">
                Tasks completed this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <CalendarIcon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksByType.all.filter(task => task.status === 'scheduled').length}</div>
              <p className="text-xs text-muted-foreground">
                Upcoming maintenance tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Battery Health</CardTitle>
              <Battery className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                Fleet-wide average battery health
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Charging Sessions</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockChargingData.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Total charging sessions this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Leaf className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockChargingData.co2Saved}kg</div>
              <p className="text-xs text-muted-foreground">
                Carbon emissions saved vs ICE
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
              <ThermometerSun className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockChargingData.avgEfficiency}%</div>
              <p className="text-xs text-muted-foreground">
                Average charging efficiency
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                Overview of scheduled maintenance and charging tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="preventive">Preventive</TabsTrigger>
                  <TabsTrigger value="charging">Charging</TabsTrigger>
                  <TabsTrigger value="battery">Battery</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {renderTaskList(tasksByType.all)}
                </TabsContent>
                <TabsContent value="preventive" className="space-y-4">
                  {renderTaskList(tasksByType.preventive)}
                </TabsContent>
                <TabsContent value="charging" className="space-y-4">
                  {renderTaskList(tasksByType.charging)}
                </TabsContent>
                <TabsContent value="battery" className="space-y-4">
                  {renderTaskList(tasksByType.battery)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Schedule and track maintenance & charging tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex h-full flex-col">
                <div className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border mx-auto"
                    modifiers={{
                      taskDay: (date) => {
                        const dateStr = format(date, "yyyy-MM-dd")
                        return tasks.some(task => {
                          const taskDate = new Date(task.scheduledDate)
                          return format(taskDate, "yyyy-MM-dd") === dateStr
                        })
                      },
                      chargingDay: (date) => {
                        const dateStr = format(date, "yyyy-MM-dd")
                        return tasks.some(task => {
                          const taskDate = new Date(task.scheduledDate)
                          return format(taskDate, "yyyy-MM-dd") === dateStr && task.type === 'charging'
                        })
                      },
                      batteryDay: (date) => {
                        const dateStr = format(date, "yyyy-MM-dd")
                        return tasks.some(task => {
                          const taskDate = new Date(task.scheduledDate)
                          return format(taskDate, "yyyy-MM-dd") === dateStr && task.type === 'battery'
                        })
                      }
                    }}
                    modifiersStyles={{
                      taskDay: {
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        textDecorationColor: 'var(--primary)',
                        textDecorationThickness: '2px'
                      },
                      chargingDay: {
                        backgroundColor: 'var(--warning-50)',
                        color: 'var(--warning)',
                        fontWeight: 'bold'
                      },
                      batteryDay: {
                        backgroundColor: 'var(--success-50)',
                        color: 'var(--success)',
                        fontWeight: 'bold'
                      }
                    }}
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                      day: "h-9 w-9 p-0 font-normal hover:bg-muted",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
                
                <ScrollArea className="h-[300px] px-4 py-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        {selectedDate ? (
                          `Tasks for ${format(selectedDate, 'MMMM d, yyyy')}`
                        ) : (
                          'Select a date to view tasks'
                        )}
                      </h4>
                      <Button variant="outline" size="sm" onClick={handleCreateTask}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    </div>
                    
                    {selectedDate && tasks
                      ?.filter(task => {
                        const taskDate = new Date(task.scheduledDate)
                        return format(taskDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                      })
                      .sort((a, b) => a.estimatedDuration - b.estimatedDuration)
                      .map(task => (
                        <Card key={task.id} className="p-3">
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-medium leading-none">{task.title}</h5>
                                {task.type === 'charging' && (
                                  <Badge variant="secondary" className="h-5">
                                    <Zap className="mr-1 h-3 w-3" />
                                    Charging
                                  </Badge>
                                )}
                                {task.type === 'battery' && (
                                  <Badge variant="secondary" className="h-5">
                                    <Battery className="mr-1 h-3 w-3" />
                                    Battery
                                  </Badge>
                                )}
                                {task.type === 'preventive' && (
                                  <Badge variant="secondary" className="h-5">
                                    <Wrench className="mr-1 h-3 w-3" />
                                    Preventive
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                  <Timer className="mr-1 h-3 w-3" />
                                  {task.estimatedDuration} min
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="mr-1 h-3 w-3" />
                                  ${task.cost?.toFixed(2) || '0.00'}
                                </div>
                                {task.assignedTo && (
                                  <div className="flex items-center">
                                    <Users className="mr-1 h-3 w-3" />
                                    {task.assignedTo}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={task.status} />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </Card>
                      ))}
                    {selectedDate && (!tasks?.some(task => {
                      const taskDate = new Date(task.scheduledDate)
                      return format(taskDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                    })) && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No tasks scheduled for this date</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={handleCreateTask}>
                          <Plus className="mr-2 h-4 w-4" />
                          Schedule Task
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MaintenanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
      />
    </>
  )
}

function StatusBadge({ status }: { status: MaintenanceStatus }) {
  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'scheduled':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
      case 'overdue':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  )
} 