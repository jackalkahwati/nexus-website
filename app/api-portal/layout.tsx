import * as React from "react"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

interface ApiPortalLayoutProps {
  children: React.ReactNode
}

export default function ApiPortalLayout({ children }: ApiPortalLayoutProps) {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        {children}
      </div>
    </DashboardLayout>
  )
}
