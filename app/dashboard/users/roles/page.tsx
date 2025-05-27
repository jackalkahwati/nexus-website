import { Metadata } from "next"
import dynamic from "next/dynamic"

const RolesClient = dynamic(() => import("./roles-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  ),
})

export const metadata: Metadata = {
  title: "Roles",
  description: "Manage user roles and permissions",
}

export default function RolesPage() {
  return <RolesClient />
} 