'use client'

import { Check, Copy, Key, Lock, Shield, Terminal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AuthenticationSetupPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const codeExamples = [
    {
      language: 'Python',
      code: `from lattis_nexus import Client

client = Client(api_key='your_api_key')
client.authenticate()

# Make authenticated requests
response = client.fleet.get_vehicles()`
    },
    {
      language: 'JavaScript',
      code: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});

// Make authenticated requests
const vehicles = await client.fleet.getVehicles();`
    },
    {
      language: 'Java',
      code: `import com.lattisnexus.Client;

Client client = new Client.Builder()
    .setApiKey("your_api_key")
    .build();

// Make authenticated requests
List<Vehicle> vehicles = client.fleet().getVehicles();`
    }
  ]

  const securityBestPractices = [
    {
      title: "Environment Variables",
      description: "Store API keys in environment variables, never in source code",
      icon: Lock,
    },
    {
      title: "Key Rotation",
      description: "Regularly rotate API keys and revoke compromised credentials",
      icon: Key,
    },
    {
      title: "Access Control",
      description: "Implement proper access controls and role-based permissions",
      icon: Shield,
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Authentication Setup
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn how to authenticate your applications with the Lattis - Nexus platform
            and secure your API requests.
          </p>
        </div>

        {/* Getting API Keys */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Getting Your API Keys</h2>
          <div className="bg-gray-800/30 rounded-xl p-8">
            <ol className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create a Developer Account</h3>
                  <p className="text-gray-400">
                    Sign up for a developer account at the Lattis - Nexus Developer Portal.
                    Verify your email address to activate your account.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Generate API Keys</h3>
                  <p className="text-gray-400">
                    Navigate to the API Keys section in your developer dashboard.
                    Create a new API key and specify the required permissions.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Store Securely</h3>
                  <p className="text-gray-400">
                    Copy your API key and store it securely. Remember, this key will only be
                    shown once and cannot be retrieved later.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* Code Examples */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Implementation Examples</h2>
          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">{example.language}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example.code, index)}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <pre className="p-6 text-gray-300 overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Security Best Practices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {securityBestPractices.map((practice, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <practice.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">{practice.title}</h3>
                </div>
                <p className="text-gray-400">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 