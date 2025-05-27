'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Code,
  Book,
  Terminal,
  GitBranch,
  Zap,
  ChevronRight,
  FileText,
  Database,
  Cpu,
  Network,
  Settings,
  Shield,
  BookOpen
} from 'lucide-react'

type TabType = 'overview' | 'documentation' | 'tools'

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const resources = [
    {
      title: "Getting Started",
      description: "Quick start guides and tutorials",
      icon: <Book className="w-6 h-6" />,
      items: [
        "Platform Overview",
        "Authentication Setup",
        "First API Request",
        "SDK Installation"
      ]
    },
    {
      title: "API Documentation",
      description: "Complete API reference",
      icon: <Code className="w-6 h-6" />,
      items: [
        "REST APIs",
        "WebSocket APIs",
        "GraphQL Schema",
        "API Versioning"
      ]
    },
    {
      title: "SDKs & Tools",
      description: "Official libraries and tools",
      icon: <Terminal className="w-6 h-6" />,
      items: [
        "Python SDK",
        "JavaScript SDK",
        "Java SDK",
        "CLI Tools"
      ]
    }
  ]

  const guides = [
    {
      title: "Fleet Integration",
      icon: <Database className="w-6 h-6" />,
      description: "Learn how to integrate your fleet with our platform",
      link: "/docs/integration"
    },
    {
      title: "Real-time Data",
      icon: <Zap className="w-6 h-6" />,
      description: "Handle real-time telemetry and events",
      link: "/docs/realtime"
    },
    {
      title: "Edge Computing",
      icon: <Cpu className="w-6 h-6" />,
      description: "Deploy and manage edge applications",
      link: "/docs/edge"
    },
    {
      title: "Data Pipeline",
      icon: <Network className="w-6 h-6" />,
      description: "Build custom data processing pipelines",
      link: "/docs/pipeline"
    },
    {
      title: "Security",
      icon: <Shield className="w-6 h-6" />,
      description: "Security best practices and compliance",
      link: "/docs/security"
    },
    {
      title: "Configuration",
      icon: <Settings className="w-6 h-6" />,
      description: "Platform configuration and settings",
      link: "/docs/config"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Developer Portal
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to build with Lattis - Nexus platform.
            Documentation, tools, and resources for developers.
          </p>
        </div>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "API Reference",
                description: "Complete API documentation",
                icon: <FileText className="w-6 h-6" />,
                link: "/api-portal"
              },
              {
                title: "Sample Code",
                description: "Example projects and demos",
                icon: <GitBranch className="w-6 h-6" />,
                link: "/docs/examples"
              },
              {
                title: "Developer Tools",
                description: "SDKs and utilities",
                icon: <Terminal className="w-6 h-6" />,
                link: "/docs/tools"
              }
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Documentation Grid */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Documentation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                    <p className="text-sm text-gray-400">{resource.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {resource.items.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={`/docs/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Guides */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Integration Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Link
                key={index}
                href={guide.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    {guide.icon}
                  </div>
                  <h3 className="font-semibold">{guide.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">{guide.description}</p>
                <div className="flex items-center gap-1 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span className="text-sm">Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Community & Support */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Community & Support</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Developer Community</h3>
                <p className="text-gray-300 mb-6">
                  Join our community of developers building with Lattis - Nexus.
                  Share knowledge, ask questions, and collaborate.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/community"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
                  >
                    Join Community
                  </Link>
                  <Link
                    href="/discord"
                    className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Discord Server
                  </Link>
                </div>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Technical Support</h3>
                <p className="text-gray-300 mb-6">
                  Need help with integration or have technical questions?
                  Our support team is here to help.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="mailto:support@lattis-nexus.com"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/docs/faq"
                    className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    View FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 