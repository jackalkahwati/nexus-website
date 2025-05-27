'use client'

import { AlertCircle, ArrowRight, Calendar, GitBranch, GitCommit, GitMerge, History } from 'lucide-react'
import Link from 'next/link'

export default function ApiVersioningPage() {
  const versions = [
    {
      version: "v2.0",
      status: "Current",
      releaseDate: "2024-01-15",
      endOfLife: "2025-01-15",
      changes: [
        "Enhanced real-time data streaming capabilities",
        "New fleet management endpoints",
        "Improved error handling and validation",
        "Additional authentication methods"
      ]
    },
    {
      version: "v1.5",
      status: "Maintained",
      releaseDate: "2023-07-01",
      endOfLife: "2024-07-01",
      changes: [
        "Added support for batch operations",
        "Introduced new analytics endpoints",
        "Performance improvements",
        "Bug fixes and stability improvements"
      ]
    },
    {
      version: "v1.0",
      status: "Deprecated",
      releaseDate: "2023-01-01",
      endOfLife: "2024-01-01",
      changes: [
        "Initial release",
        "Basic fleet management functionality",
        "Core API endpoints",
        "Basic authentication"
      ]
    }
  ]

  const migrationSteps = [
    {
      title: "Review Changes",
      description: "Understand the differences between API versions and plan your migration",
      icon: History,
    },
    {
      title: "Update SDK",
      description: "Upgrade to the latest SDK version compatible with the target API version",
      icon: GitBranch,
    },
    {
      title: "Test Integration",
      description: "Thoroughly test your integration with the new API version",
      icon: GitCommit,
    },
    {
      title: "Deploy Changes",
      description: "Roll out the changes to your production environment",
      icon: GitMerge,
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            API Versioning
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn about our API versioning strategy and how to manage API version transitions
            in your applications.
          </p>
        </div>

        {/* Version Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Version History</h2>
          <div className="space-y-6">
            {versions.map((version, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{version.version}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          version.status === 'Current' ? 'bg-green-500/20 text-green-400' :
                          version.status === 'Maintained' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {version.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Released: {version.releaseDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>EOL: {version.endOfLife}</span>
                    </div>
                  </div>
                </div>
                <div className="pl-16">
                  <h4 className="text-lg font-medium mb-3">Changes</h4>
                  <ul className="space-y-2">
                    {version.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-center gap-2 text-gray-300">
                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Migration Guide */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Migration Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {migrationSteps.map((step, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Version Support */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Version Support Policy</h2>
            <div className="space-y-6 text-gray-300">
              <p>
                We maintain multiple API versions to ensure a smooth transition period for our users.
                Each version is supported for at least 12 months after its release.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Support Levels</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span><strong>Current:</strong> Latest stable version with full support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span><strong>Maintained:</strong> Previous version with security updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span><strong>Deprecated:</strong> End-of-life version with no updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 