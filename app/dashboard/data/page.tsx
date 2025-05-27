import { Metadata } from "next"
import dynamic from "next/dynamic"

const DataManagementClient = dynamic(
  () => import("./data-client").then((mod) => mod.DataManagementClient),
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
  title: "Data Management",
  description: "Export and import your data",
}

export default function DataManagementPage() {
  return <DataManagementClient />
} 