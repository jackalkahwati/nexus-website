'use client'

import { ArrowRight, Book, Check, Code, Copy, FileCode, GitBranch, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function GettingStartedPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const steps = [
    {
      title: "Create an Account",
      description: "Sign up for a Lattis - Nexus developer account",
      code: null,
      substeps: [
        "Visit the developer portal",
        "Fill out the registration form",
        "Verify your email address",
        "Complete your profile"
      ]
    },
    {
      title: "Generate API Keys",
      description: "Create API keys for authentication",
      code: null,
      substeps: [
        "Navigate to API Keys in your dashboard",
        "Click 'Create New API Key'",
        "Select required permissions",
        "Store your API key securely"
      ]
    },
    {
      title: "Install SDK",
      description: "Install the SDK for your preferred language",
      code: {
        npm: "npm install @lattis-nexus/sdk",
        pip: "pip install lattis-nexus",
        maven: `<dependency>
  <groupId>com.lattisnexus</groupId>
  <artifactId>sdk</artifactId>
  <version>2.0.0</version>
</dependency>`
      }
    },
    {
      title: "Initialize Client",
      description: "Set up the client with your API key",
      code: {
        javascript: `import { LattisNexusClient } from '@lattis-nexus/sdk';

const client = new LattisNexusClient({
  apiKey: 'your_api_key'
});`,
        python: `from lattis_nexus import Client

client = Client(api_key='your_api_key')`
      }
    },
    {
      title: "Make First Request",
      description: "Test your setup with a simple API call",
      code: {
        javascript: `// Get fleet vehicles
const vehicles = await client.fleet.getVehicles();
console.log('Total vehicles:', vehicles.length);`,
        python: `# Get fleet vehicles
vehicles = client.fleet.get_vehicles()
print('Total vehicles:', len(vehicles))`
      }
    }
  ]

  const nextSteps = [
    {
      title: "Explore API Reference",
      description: "Browse complete API documentation",
      icon: Book,
      link: "/docs/api"
    },
    {
      title: "SDK Documentation",
      description: "Learn about SDK features and capabilities",
      icon: FileCode,
      link: "/docs/sdk"
    },
    {
      title: "Example Projects",
      description: "View sample applications and code",
      icon: GitBranch,
      link: "/docs/examples"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Getting Started
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow this guide to start building with Lattis - Nexus.
            Learn how to set up your development environment and make your first API call.
          </p>
        </div>

        {/* Prerequisites */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Prerequisites</h2>
          <div className="bg-gray-800/30 rounded-xl p-8">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Basic knowledge of your preferred programming language</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Understanding of RESTful APIs</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Development environment set up</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step by Step Guide */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Step-by-Step Guide</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>

                {step.substeps && (
                  <div className="mb-6">
                    <ul className="space-y-3">
                      {step.substeps.map((substep, substepIndex) => (
                        <li key={substepIndex} className="flex items-center gap-2 text-gray-300">
                          <ArrowRight className="w-4 h-4 text-cyan-400" />
                          {substep}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.code && (
                  <div className="space-y-4">
                    {Object.entries(step.code).map(([language, code], codeIndex) => (
                      <div key={codeIndex} className="bg-gray-900/50 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-medium">{language}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code, index * 10 + codeIndex)}
                            className="text-gray-400 hover:text-white"
                          >
                            {copiedIndex === index * 10 + codeIndex ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                          <code>{code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Next Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <Link
                key={index}
                href={step.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 