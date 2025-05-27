"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/profile/sidebar-nav"
import { BillingProvider } from "@/contexts/BillingContext"

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
  },
  {
    title: "Billing",
    href: "/dashboard/profile/billing",
  },
  {
    title: "Notifications",
    href: "/dashboard/profile/notifications",
  },
  {
    title: "Security",
    href: "/dashboard/profile/security",
  },
]

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <BillingProvider>
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </BillingProvider>
  )
} 