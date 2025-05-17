"use client"

import { IntegrationProvider } from "@/contexts/IntegrationContext"

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <IntegrationProvider>{children}</IntegrationProvider>
} 