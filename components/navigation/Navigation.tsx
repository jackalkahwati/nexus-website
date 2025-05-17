"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  BarChart,
  Building2,
  ChevronDown,
  CircuitBoard,
  CreditCard,
  FileText,
  Gauge,
  LifeBuoy,
  Settings,
  Truck,
  Users,
  Wrench,
  Route,
  Map,
  Clock,
  Calendar,
  Database,
  Package,
  Shield,
  Code,
  ListTodo,
  MessageSquare,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  submenu?: {
    title: string
    href: string
    icon?: LucideIcon
  }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    title: "Fleet",
    href: "/dashboard/fleet",
    icon: Truck,
  },
  {
    title: "Users",
    href: "/dashboard/users/all",
    icon: Users,
    submenu: [
      {
        title: "All Users",
        href: "/dashboard/users/all",
        icon: Users,
      },
      {
        title: "Teams",
        href: "/dashboard/users/teams",
        icon: Users,
      },
      {
        title: "Roles",
        href: "/dashboard/users/roles",
        icon: Shield,
      },
      {
        title: "Permissions",
        href: "/dashboard/users/permissions",
        icon: Shield,
      },
    ],
  },
  {
    title: "Maintenance",
    href: "/dashboard/maintenance",
    icon: Wrench,
    submenu: [
      {
        title: "Tasks",
        href: "/dashboard/maintenance",
        icon: ListTodo,
      },
      {
        title: "Parts",
        href: "/dashboard/parts",
        icon: Package,
      },
      {
        title: "History",
        href: "/dashboard/maintenance/history",
        icon: Clock,
      },
      {
        title: "Schedule",
        href: "/dashboard/maintenance/schedule",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Operations",
    href: "/dashboard/operations",
    icon: Database,
    submenu: [
      {
        title: "Live Map",
        href: "/dashboard/map",
        icon: Map,
      },
      {
        title: "Routes",
        href: "/dashboard/routes",
        icon: Route,
      },
      {
        title: "ETA",
        href: "/dashboard/eta",
        icon: Clock,
      },
      {
        title: "Bookings",
        href: "/dashboard/bookings",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: CircuitBoard,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    submenu: [
      {
        title: "Fleet Settings",
        href: "/dashboard/payments/settings",
        icon: Settings,
      },
      {
        title: "Payment History",
        href: "/dashboard/payments/history",
        icon: Clock,
      },
      {
        title: "Platform Billing",
        href: "/dashboard/payments/platform",
        icon: Building2,
      },
    ],
  },
  {
    title: "Insurance",
    href: "/dashboard/insurance",
    icon: Shield,
  },
  {
    title: "API Portal",
    href: "/api-portal",
    icon: Code,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: LifeBuoy,
  },
]

interface NavigationProps {
  isCollapsed: boolean
}

export function Navigation({ isCollapsed }: NavigationProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = React.useState<string[]>([])

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative h-full">
        <ScrollArea className="h-full py-4">
          <div className={cn("space-y-2", isCollapsed ? "px-2" : "px-3")}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const isOpen = openMenus.includes(item.title)
              const Icon = item.icon

              if (item.submenu) {
                return (
                  <div key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full",
                            isCollapsed ? "h-10 w-10 p-0" : "h-10 justify-start px-3",
                            isActive && "font-medium"
                          )}
                          onClick={() => toggleMenu(item.title)}
                        >
                          <div className="flex items-center">
                            <Icon className={cn(
                              "h-5 w-5",
                              !isCollapsed && "mr-2",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            {!isCollapsed && (
                              <>
                                <span className="text-sm flex-1">{item.title}</span>
                                <ChevronDown className={cn(
                                  "h-4 w-4 transition-transform",
                                  isOpen && "transform rotate-180"
                                )} />
                              </>
                            )}
                          </div>
                        </Button>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="flex items-center">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                    {isOpen && !isCollapsed && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.submenu.map((subItem) => {
                          const isSubActive = pathname === subItem.href
                          const SubIcon = subItem.icon || item.icon
                          return (
                            <Link key={subItem.href} href={subItem.href}>
                              <Button
                                variant={isSubActive ? "secondary" : "ghost"}
                                className={cn(
                                  "w-full justify-start",
                                  isSubActive && "font-medium"
                                )}
                              >
                                <SubIcon className={cn(
                                  "h-4 w-4 mr-2",
                                  isSubActive ? "text-primary" : "text-muted-foreground"
                                )} />
                                <span className="text-sm">{subItem.title}</span>
                              </Button>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          isCollapsed ? "h-10 w-10 p-0" : "h-10 justify-start px-3",
                          isActive && "font-medium"
                        )}
                      >
                        <div className="flex items-center">
                          <Icon className={cn(
                            "h-5 w-5",
                            !isCollapsed && "mr-2",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )} />
                          {!isCollapsed && (
                            <span className="text-sm">{item.title}</span>
                          )}
                        </div>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="flex items-center">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}
