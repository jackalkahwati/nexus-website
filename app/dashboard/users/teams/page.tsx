import { Metadata } from "next"
import dynamic from "next/dynamic"

const TeamsClient = dynamic(() => import("./teams-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  ),
})

export const metadata: Metadata = {
  title: "Teams",
  description: "Manage teams and team members",
}

export default function TeamsPage() {
  return <TeamsClient />
} 