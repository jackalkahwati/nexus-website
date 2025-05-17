import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Manage your notifications and alert preferences",
}

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 