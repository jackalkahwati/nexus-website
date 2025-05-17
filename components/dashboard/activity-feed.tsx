import { cn } from "@/lib/cn"
import { CheckCircle2, AlertCircle, Truck, MapPin, Tool, Clock } from "lucide-react"

interface Activity {
  id: number
  type: "delivery" | "alert" | "location" | "maintenance" | "status"
  title: string
  description: string
  time: string
}

const activities: Activity[] = [
  {
    id: 1,
    type: "delivery",
    title: "Delivery Completed",
    description: "Order #1234 delivered successfully",
    time: "2 min ago"
  },
  {
    id: 2,
    type: "alert",
    title: "Route Alert",
    description: "Heavy traffic detected on Route #127",
    time: "5 min ago"
  },
  {
    id: 3,
    type: "location",
    title: "Vehicle Update",
    description: "Truck #45 entered geofence zone",
    time: "12 min ago"
  },
  {
    id: 4,
    type: "maintenance",
    title: "Maintenance Alert",
    description: "Vehicle #23 due for service",
    time: "25 min ago"
  },
  {
    id: 5,
    type: "status",
    title: "Status Change",
    description: "Driver #89 started their shift",
    time: "1 hour ago"
  }
]

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "delivery":
      return CheckCircle2
    case "alert":
      return AlertCircle
    case "location":
      return MapPin
    case "maintenance":
      return Tool
    case "status":
      return Clock
    default:
      return Truck
  }
}

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "delivery":
      return "text-green-500 bg-green-100 dark:bg-green-900/50 dark:text-green-400"
    case "alert":
      return "text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-400"
    case "location":
      return "text-blue-500 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400"
    case "maintenance":
      return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400"
    case "status":
      return "text-purple-500 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-400"
    default:
      return "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
  }
}

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type)
        return (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={cn(
              "p-2 rounded-xl",
              getActivityColor(activity.type)
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
} 