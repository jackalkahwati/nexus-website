"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Wrench,
  Calendar as CalendarIcon,
  Clock,
  Settings,
  BarChart,
  Users,
  Car,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Battery,
  Pencil,
  MoreVertical,
  Trash2,
  Plus,
  Timer,
  DollarSign,
} from "lucide-react"
import { useMaintenance } from "@/contexts/MaintenanceContext"
import { MaintenanceSchedule, MaintenanceTask, ServicePriority, MaintenanceStatus, MaintenanceType } from "@/types/maintenance"
import { cn } from "@/lib/cn"
import { format, addDays, isSameDay } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/maintenance/status-badge"
import { MaintenanceDialog } from "@/components/maintenance/maintenance-dialog"

export default function ScheduleOptimizationPage() {
  const {
    schedules,
    tasks,
    isLoading,
    updateSchedule,
    calculateNextServiceDate,
    deleteTask
  } = useMaintenance()

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<MaintenanceTask | undefined>()

  const tasksForDate = React.useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate)
      return format(taskDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    })
  }, [tasks, selectedDate])

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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Schedule</h1>
            <p className="text-muted-foreground">
              Plan and manage maintenance tasks
            </p>
          </div>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Schedule and track maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
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
                  },
                  preventiveDay: (date) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    return tasks.some(task => {
                      const taskDate = new Date(task.scheduledDate)
                      return format(taskDate, "yyyy-MM-dd") === dateStr && task.type === 'preventive'
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
                  },
                  preventiveDay: {
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary)',
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
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-warning-50"></div>
                  <span>Charging Tasks</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-success-50"></div>
                  <span>Battery Tasks</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-primary-50"></div>
                  <span>Preventive Tasks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Daily Schedule</CardTitle>
              <CardDescription>
                Tasks for {format(selectedDate, "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksForDate.map(task => (
                  <Card key={task.id} className="p-3">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium leading-none">
                            {task.title}
                          </h4>
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
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
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
                {tasksForDate.length === 0 && (
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