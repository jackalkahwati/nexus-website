import { Metadata } from "next"
import dynamic from "next/dynamic"

const ClientPage = dynamic(() => import("./permissions-client"), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "Permissions",
  description: "Manage system permissions and access controls",
}

export default function PermissionsPage() {
  return <ClientPage />
} 