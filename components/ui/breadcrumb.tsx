"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    return {
      href,
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    }
  })

  return (
    <div
      className={cn(
        "inline-flex items-center space-x-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span className="hidden md:inline">Home</span>
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.href}>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={breadcrumb.href}
            className={cn(
              "hover:text-foreground",
              index === breadcrumbs.length - 1 && "text-foreground"
            )}
          >
            {breadcrumb.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
} 