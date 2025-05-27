import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/cn"

interface MetricCardProps {
  title: string
  value: string
  description: string
  trend: string
  trendType: "positive" | "negative" | "neutral"
  icon: LucideIcon
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  trendType,
  icon: Icon
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-2 rounded-xl",
              trendType === "positive" && "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
              trendType === "negative" && "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
              trendType === "neutral" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-sm font-medium",
              trendType === "positive" && "text-green-600 dark:text-green-400",
              trendType === "negative" && "text-red-600 dark:text-red-400",
              trendType === "neutral" && "text-gray-600 dark:text-gray-400"
            )}>
              {trend}
            </span>
            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 