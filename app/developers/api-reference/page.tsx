import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function APIReferencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            API Reference
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive documentation for the Lattis-Nexus API. Build powerful integrations with our
            platform using our well-documented endpoints and SDKs.
          </p>
        </div>

        {/* API Overview */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">Authentication</h3>
                <p className="text-gray-300 mb-4">
                  All API requests require authentication using API keys. You can generate API keys
                  from your dashboard.
                </p>
                <div className="bg-gray-900/50 rounded p-4">
                  <code className="text-sm text-gray-300">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">Base URL</h3>
                <p className="text-gray-300 mb-4">
                  All API requests should be made to the following base URL:
                </p>
                <div className="bg-gray-900/50 rounded p-4">
                  <code className="text-sm text-gray-300">
                    https://api.lattis-nexus.com/v1
                  </code>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-400">Quick Start</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-400/20 flex items-center justify-center text-indigo-400">1</div>
                  <span>Sign up for a Lattis-Nexus account</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-400/20 flex items-center justify-center text-indigo-400">2</div>
                  <span>Generate an API key from your dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-400/20 flex items-center justify-center text-indigo-400">3</div>
                  <span>Install our client library</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-400/20 flex items-center justify-center text-indigo-400">4</div>
                  <span>Make your first API call</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">API Endpoints</h2>
          <Tabs defaultValue="fleet" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/30">
              <TabsTrigger value="fleet">Fleet Management</TabsTrigger>
              <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="admin">Administration</TabsTrigger>
            </TabsList>
            <TabsContent value="fleet" className="mt-6">
              <div className="space-y-6">
                {[
                  {
                    method: "GET",
                    endpoint: "/fleet/vehicles",
                    description: "List all vehicles in the fleet",
                    response: {
                      vehicles: [
                        {
                          id: "v_123",
                          status: "active",
                          location: { lat: 37.7749, lng: -122.4194 }
                        }
                      ]
                    }
                  },
                  {
                    method: "POST",
                    endpoint: "/fleet/vehicles",
                    description: "Add a new vehicle to the fleet",
                    response: {
                      id: "v_123",
                      status: "created"
                    }
                  }
                ].map((endpoint, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        endpoint.method === "GET" ? "bg-green-400/20 text-green-400" :
                        endpoint.method === "POST" ? "bg-blue-400/20 text-blue-400" :
                        "bg-red-400/20 text-red-400"
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-gray-300">{endpoint.endpoint}</code>
                    </div>
                    <p className="text-gray-300 mb-4">{endpoint.description}</p>
                    <div className="bg-gray-900/50 rounded p-4">
                      <pre className="text-sm text-gray-300">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            {/* Other tab contents would follow the same pattern */}
          </Tabs>
        </div>

        {/* SDK Libraries */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">SDK Libraries</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                language: "Python",
                install: "pip install lattis-nexus",
                example: `from lattis_nexus import Client

client = Client("YOUR_API_KEY")
vehicles = client.fleet.list_vehicles()`
              },
              {
                language: "JavaScript",
                install: "npm install @lattis-nexus/sdk",
                example: `import { LattisNexus } from '@lattis-nexus/sdk';

const client = new LattisNexus('YOUR_API_KEY');
const vehicles = await client.fleet.listVehicles();`
              },
              {
                language: "Go",
                install: "go get github.com/lattis-nexus/sdk-go",
                example: `import "github.com/lattis-nexus/sdk-go"

client := lattisnexus.NewClient("YOUR_API_KEY")
vehicles, err := client.Fleet.ListVehicles()`
              }
            ].map((sdk, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">{sdk.language}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Installation</p>
                    <div className="bg-gray-900/50 rounded p-3">
                      <code className="text-sm text-gray-300">{sdk.install}</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Example</p>
                    <div className="bg-gray-900/50 rounded p-3">
                      <pre className="text-sm text-gray-300">{sdk.example}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-500 to-violet-500 p-[2px] rounded-lg">
            <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                Get API Key
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 