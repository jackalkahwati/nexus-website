import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/cn"

interface AlertCardProps {
  title: string
  description: string
  icon: LucideIcon
  variant: "warning" | "destructive" | "success"
}

export function AlertCard({
  title,
  description,
  icon: Icon,
  variant
}: AlertCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={cn(
            "p-2 rounded-xl",
            variant === "warning" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400",
            variant === "destructive" && "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
            variant === "success" && "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className={cn(
              "text-sm font-medium",
              variant === "warning" && "text-yellow-700 dark:text-yellow-400",
              variant === "destructive" && "text-red-700 dark:text-red-400",
              variant === "success" && "text-green-700 dark:text-green-400"
            )}>
              {title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 