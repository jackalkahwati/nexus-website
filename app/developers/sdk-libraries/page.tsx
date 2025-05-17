export default function SDKLibrariesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">
            SDK Libraries
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Official client libraries for integrating with the Lattis-Nexus platform.
            Choose your preferred programming language and start building powerful integrations.
          </p>
        </div>

        {/* Language Selection */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              language: "Python",
              icon: "🐍",
              description: "Official Python SDK for Lattis-Nexus",
              version: "2.1.0",
              stability: "Stable"
            },
            {
              language: "JavaScript",
              icon: "⚡",
              description: "Node.js and browser SDK",
              version: "3.0.1",
              stability: "Stable"
            },
            {
              language: "Go",
              icon: "🔷",
              description: "Go client library",
              version: "1.4.0",
              stability: "Stable"
            }
          ].map((sdk, index) => (
            <div key={index} className="bg-gray-800/30 rounded-2xl p-6 hover:bg-gray-800/40 transition-all cursor-pointer">
              <div className="text-4xl mb-4">{sdk.icon}</div>
              <h2 className="text-2xl font-bold mb-2 text-fuchsia-400">{sdk.language}</h2>
              <p className="text-gray-300 mb-4">{sdk.description}</p>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-fuchsia-400/20 text-fuchsia-400 rounded-full text-sm">
                  v{sdk.version}
                </span>
                <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                  {sdk.stability}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Installation & Usage */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Quick Start Guides</h2>
          
          {/* Python SDK */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-fuchsia-400">Python SDK</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 mb-3">Installation</p>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <code className="text-gray-300">pip install lattis-nexus</code>
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-3">Basic Usage</p>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <pre className="text-gray-300">{`from lattis_nexus import Client

# Initialize the client
client = Client("YOUR_API_KEY")

# List all vehicles
vehicles = client.fleet.list_vehicles()

# Get vehicle details
vehicle = client.fleet.get_vehicle("vehicle_id")

# Update vehicle status
client.fleet.update_vehicle_status("vehicle_id", status="active")`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* JavaScript SDK */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-fuchsia-400">JavaScript SDK</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 mb-3">Installation</p>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <code className="text-gray-300">npm install @lattis-nexus/sdk</code>
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-3">Basic Usage</p>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <pre className="text-gray-300">{`import { LattisNexus } from '@lattis-nexus/sdk';

// Initialize the client
const client = new LattisNexus('YOUR_API_KEY');

// List all vehicles
const vehicles = await client.fleet.listVehicles();

// Get vehicle details
const vehicle = await client.fleet.getVehicle('vehicle_id');

// Update vehicle status
await client.fleet.updateVehicleStatus('vehicle_id', { status: 'active' });`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Go SDK */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-fuchsia-400">Go SDK</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 mb-3">Installation</p>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <code className="text-gray-300">go get github.com/lattis-nexus/sdk-go</code>
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-3">Basic Usage</p>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <pre className="text-gray-300">{`package main

import "github.com/lattis-nexus/sdk-go"

func main() {
    // Initialize the client
    client := lattisnexus.NewClient("YOUR_API_KEY")

    // List all vehicles
    vehicles, err := client.Fleet.ListVehicles()

    // Get vehicle details
    vehicle, err := client.Fleet.GetVehicle("vehicle_id")

    // Update vehicle status
    err = client.Fleet.UpdateVehicleStatus("vehicle_id", "active")
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Type Safety",
                description: "Full type definitions and IDE support for all SDKs"
              },
              {
                title: "Async Support",
                description: "Built-in support for async/await and promises"
              },
              {
                title: "Error Handling",
                description: "Comprehensive error types and handling mechanisms"
              },
              {
                title: "Automatic Retries",
                description: "Configurable retry mechanisms for failed requests"
              },
              {
                title: "Rate Limiting",
                description: "Built-in rate limiting and backoff strategies"
              },
              {
                title: "Middleware Support",
                description: "Extensible middleware system for custom logic"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-fuchsia-400">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support & Resources */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Need Help?</h2>
          <div className="flex justify-center gap-6">
            <button className="px-6 py-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-gray-300">
              View Documentation
            </button>
            <button className="px-6 py-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-gray-300">
              Join Discord Community
            </button>
            <button className="px-6 py-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-gray-300">
              GitHub Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 