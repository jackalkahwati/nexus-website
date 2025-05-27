import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Server, Database, Laptop, Workflow, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function IntegrationGuidePage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Integration Guide</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Step-by-step guide to integrating with the Lattis platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <Server className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">API Integration</h3>
          <p className="text-muted-foreground">
            Connect your systems with our REST API
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/docs/api">
              View API Docs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <Laptop className="h-12 w-12 text-green-500" />
          <h3 className="text-xl font-semibold">SDK Integration</h3>
          <p className="text-muted-foreground">
            Use our client libraries and SDKs
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/docs/sdk">
              View SDKs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <Database className="h-12 w-12 text-purple-500" />
          <h3 className="text-xl font-semibold">Data Integration</h3>
          <p className="text-muted-foreground">
            Sync and manage your fleet data
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/docs/data">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="data">Data Model</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Integration Overview</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The Lattis platform offers multiple integration options:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>REST API for direct integration</li>
                <li>SDKs for multiple programming languages</li>
                <li>WebSocket streams for real-time data</li>
                <li>Webhook notifications for events</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Integration Setup</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">1. Create Account</h4>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">• Sign up at dashboard.lattis.com</p>
                  <p className="text-sm text-muted-foreground">• Verify your email address</p>
                  <p className="text-sm text-muted-foreground">• Complete organization profile</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">2. Generate API Keys</h4>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">• Navigate to Settings > API Keys</p>
                  <p className="text-sm text-muted-foreground">• Create new API key pair</p>
                  <p className="text-sm text-muted-foreground">• Save credentials securely</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">3. Choose Integration Method</h4>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">• Review available integration options</p>
                  <p className="text-sm text-muted-foreground">• Select appropriate SDK or API</p>
                  <p className="text-sm text-muted-foreground">• Follow implementation guide</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Data Model</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Core Entities</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
// Vehicle
{
  "id": "v123",
  "type": "autonomous",
  "status": "active",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  }
}

// Fleet
{
  "id": "f456",
  "name": "SF Fleet",
  "vehicles": ["v123", "v124"],
  "region": "san-francisco"
}
                    `.trim()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Integration Examples</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Basic Integration</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
// Initialize client
const lattis = new LattisClient({
  apiKey: process.env.LATTIS_API_KEY,
  apiSecret: process.env.LATTIS_API_SECRET
});

// Get fleet data
const fleet = await lattis.fleet.list();

// Subscribe to updates
lattis.subscribe('vehicle_status', (event) => {
  console.log('Vehicle status:', event);
});
                    `.trim()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="space-y-4">
            <Workflow className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-semibold">Integration Patterns</h3>
            <p className="text-muted-foreground">
              Common integration patterns and best practices
            </p>
            <Button variant="outline" className="w-full">
              View Patterns
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <Settings className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-semibold">Configuration</h3>
            <p className="text-muted-foreground">
              Advanced configuration options and settings
            </p>
            <Button variant="outline" className="w-full">
              View Configuration
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 