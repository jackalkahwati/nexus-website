import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Code, FileText, Laptop, MessageSquare, Rocket, Server, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Quick start guides and tutorials",
      icon: Rocket,
      href: "/docs/getting-started",
      color: "text-blue-500"
    },
    {
      title: "API Reference",
      description: "Complete API documentation",
      icon: Code,
      href: "/docs/api",
      color: "text-purple-500"
    },
    {
      title: "SDK Libraries",
      description: "Client libraries and tools",
      icon: Laptop,
      href: "/docs/sdk",
      color: "text-green-500"
    },
    {
      title: "Integration Guide",
      description: "Step-by-step integration instructions",
      icon: Server,
      href: "/docs/integration",
      color: "text-orange-500"
    },
    {
      title: "WebSocket Streams",
      description: "Real-time data streaming",
      icon: Zap,
      href: "/docs/websocket",
      color: "text-yellow-500"
    },
    {
      title: "Release Notes",
      description: "Latest updates and changes",
      icon: FileText,
      href: "/docs/releases",
      color: "text-red-500"
    },
    {
      title: "Security",
      description: "Security features and best practices",
      icon: Shield,
      href: "/docs/security",
      color: "text-cyan-500"
    }
  ]

  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to integrate and build with Lattis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link key={section.title} href={section.href}>
            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <section.icon className={`h-12 w-12 ${section.color}`} />
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <p className="text-muted-foreground">
                {section.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8">
          <div className="space-y-4">
            <BookOpen className="h-12 w-12 text-blue-500" />
            <h3 className="text-2xl font-semibold">Need Help?</h3>
            <p className="text-muted-foreground">
              Our support team is here to assist you with any questions or issues.
            </p>
            <Button asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        </Card>

        <Card className="p-8">
          <div className="space-y-4">
            <MessageSquare className="h-12 w-12 text-green-500" />
            <h3 className="text-2xl font-semibold">Join the Community</h3>
            <p className="text-muted-foreground">
              Connect with other developers and share your experiences.
            </p>
            <Button asChild variant="outline">
              <Link href="/community">Visit Forums</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
