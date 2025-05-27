import { Metadata } from "next"
import dynamic from "next/dynamic"

const ComplianceClient = dynamic(
  () => import("./compliance-client").then((mod) => mod.ComplianceClient),
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
  title: "SOC2 Compliance Dashboard",
  description: "Monitor and manage SOC2 compliance status and controls",
}

export default function CompliancePage() {
  return <ComplianceClient />
}
