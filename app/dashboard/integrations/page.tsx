import { Metadata } from "next"
import dynamic from "next/dynamic"

const IntegrationsClient = dynamic(
  () => import("./integrations-client").then(mod => ({ default: mod.IntegrationsClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    ),
  }
)

export const metadata: Metadata = {
  title: "Integrations",
  description: "Monitor and manage your external service connections",
}

export default function IntegrationsPage() {
  return <IntegrationsClient />
} 