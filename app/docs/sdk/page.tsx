import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Download, Globe, Laptop, Terminal } from "lucide-react"
import Link from "next/link"

export default function SdkPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">SDK Libraries</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Official client libraries for multiple programming languages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <Code className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">JavaScript</h3>
          <p className="text-muted-foreground">
            Node.js and browser support
          </p>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" /> npm install @lattis/sdk
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <Terminal className="h-12 w-12 text-green-500" />
          <h3 className="text-xl font-semibold">Python</h3>
          <p className="text-muted-foreground">
            Python 3.6+ compatibility
          </p>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" /> pip install lattis
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <Globe className="h-12 w-12 text-purple-500" />
          <h3 className="text-xl font-semibold">Go</h3>
          <p className="text-muted-foreground">
            Go 1.16+ support
          </p>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" /> go get github.com/lattis/sdk
          </Button>
        </Card>
      </div>

      <Tabs defaultValue="javascript" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="go">Go</TabsTrigger>
        </TabsList>

        <TabsContent value="javascript" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">JavaScript SDK</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Installation</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>npm install @lattis/sdk</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Usage</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
import { LattisClient } from '@lattis/sdk';

const client = new LattisClient({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret'
});

// Get fleet information
const fleet = await client.fleet.list();

// Monitor vehicle status
client.vehicles.subscribe('vehicle_id', (status) => {
  console.log('Vehicle status updated:', status);
});
                    `.trim()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="python" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Python SDK</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Installation</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>pip install lattis</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Usage</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
from lattis import Client

client = Client(
    api_key='your_api_key',
    api_secret='your_api_secret'
)

# Get fleet information
fleet = client.fleet.list()

# Monitor vehicle status
def on_status_update(status):
    print(f"Vehicle status updated: {status}")

client.vehicles.subscribe('vehicle_id', on_status_update)
                    `.trim()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="go" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Go SDK</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Installation</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>go get github.com/lattis/sdk</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Usage</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
package main

import (
    "fmt"
    "github.com/lattis/sdk"
)

func main() {
    client := sdk.NewClient(
        sdk.WithAPIKey("your_api_key"),
        sdk.WithAPISecret("your_api_secret"),
    )

    // Get fleet information
    fleet, err := client.Fleet.List(context.Background())
    if err != nil {
        panic(err)
    }

    // Monitor vehicle status
    client.Vehicles.Subscribe("vehicle_id", func(status *sdk.VehicleStatus) {
        fmt.Printf("Vehicle status updated: %+v\\n", status)
    })
}
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
            <Terminal className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-semibold">CLI Tool</h3>
            <p className="text-muted-foreground">
              Command-line interface for fleet management
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/docs/cli">
                View CLI Documentation
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <Laptop className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-semibold">Example Projects</h3>
            <p className="text-muted-foreground">
              Sample applications and integrations
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/docs/examples">
                View Examples
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 