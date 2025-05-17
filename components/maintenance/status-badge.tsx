import { Badge } from "@/components/ui/badge"
import { MaintenanceStatus } from "@/types/maintenance"
import { cn } from "@/lib/cn"

interface StatusBadgeProps {
  status: MaintenanceStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Badge className={cn(getStatusColor(status), className)}>
      {status.replace('_', ' ')}
    </Badge>
  )
} 