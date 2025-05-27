import { Metadata } from "next"
import dynamic from "next/dynamic"

const MonitoringClient = dynamic(
  () => import("./monitoring-client").then((mod) => mod.MonitoringClient),
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
  title: "System Monitoring | Dashboard",
  description: "Monitor system performance, logs, and metrics",
}

export default function MonitoringPage() {
  return <MonitoringClient />
}
