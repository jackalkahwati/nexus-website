import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Star, Bug, Zap, ArrowRight, Rocket } from "lucide-react"
import Link from "next/link"

export default function ReleasesPage() {
  const releases = [
    {
      version: "2.4.0",
      date: "December 15, 2023",
      type: "major",
      features: [
        "New fleet analytics dashboard",
        "Enhanced route optimization algorithm",
        "Real-time vehicle tracking improvements"
      ],
      fixes: [
        "Fixed memory leak in WebSocket connections",
        "Improved error handling in API responses",
        "Resolved timezone synchronization issues"
      ],
      breaking: [
        "Deprecated legacy API endpoints (v1)",
        "Updated authentication flow"
      ]
    },
    {
      version: "2.3.2",
      date: "December 1, 2023",
      type: "patch",
      features: [
        "Added new telemetry metrics",
        "Improved SDK documentation"
      ],
      fixes: [
        "Fixed data synchronization issues",
        "Resolved WebSocket reconnection bugs"
      ]
    },
    {
      version: "2.3.1",
      date: "November 15, 2023",
      type: "patch",
      features: [
        "Performance optimizations",
        "New SDK helper functions"
      ],
      fixes: [
        "Fixed API rate limiting issues",
        "Improved error messages"
      ]
    }
  ]

  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Release Notes</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Latest updates and changes to the Lattis platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <Star className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">New Features</h3>
          <p className="text-muted-foreground">
            Latest features and improvements
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Bug className="h-12 w-12 text-red-500" />
          <h3 className="text-xl font-semibold">Bug Fixes</h3>
          <p className="text-muted-foreground">
            Recent bug fixes and patches
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Zap className="h-12 w-12 text-yellow-500" />
          <h3 className="text-xl font-semibold">Breaking Changes</h3>
          <p className="text-muted-foreground">
            Important updates requiring action
          </p>
        </Card>
      </div>

      <div className="space-y-8">
        {releases.map((release) => (
          <Card key={release.version} className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    v{release.version}
                    {release.type === "major" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                        Major Release
                      </span>
                    )}
                  </h3>
                  <p className="text-muted-foreground">{release.date}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/docs/releases/${release.version}`}>
                    Full Release Notes <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {release.features && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      New Features
                    </h4>
                    <ul className="space-y-2">
                      {release.features.map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.fixes && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Bug className="h-4 w-4 text-red-500" />
                      Bug Fixes
                    </h4>
                    <ul className="space-y-2">
                      {release.fixes.map((fix, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {fix}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.breaking && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Breaking Changes
                    </h4>
                    <ul className="space-y-2">
                      {release.breaking.map((change, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="space-y-4">
            <FileText className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-semibold">Migration Guides</h3>
            <p className="text-muted-foreground">
              Step-by-step guides for version upgrades
            </p>
            <Button variant="outline" className="w-full">
              View Migration Guides
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <Rocket className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-semibold">Roadmap</h3>
            <p className="text-muted-foreground">
              Upcoming features and improvements
            </p>
            <Button variant="outline" className="w-full">
              View Roadmap
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 