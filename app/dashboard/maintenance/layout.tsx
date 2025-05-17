"use client"

import { MaintenanceProvider } from "@/contexts/MaintenanceContext"

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MaintenanceProvider>{children}</MaintenanceProvider>
} 