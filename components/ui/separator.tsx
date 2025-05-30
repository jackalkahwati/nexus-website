"use client"

import { cn } from "@/lib/cn"

interface SeparatorProps {
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function Separator({
  className,
  orientation = "horizontal",
}: SeparatorProps) {
  return (
    <div
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      role="separator"
    />
  )
} 