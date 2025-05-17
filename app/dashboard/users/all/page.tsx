import { Metadata } from "next"
import dynamic from "next/dynamic"

const UsersClient = dynamic(() => import("./users-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  ),
})

export const metadata: Metadata = {
  title: "All Users",
  description: "Manage all users in the system",
}

export default function UsersPage() {
  return <UsersClient />
} 