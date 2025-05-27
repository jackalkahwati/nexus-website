'use client'

import { ArrowRight, HelpCircle, Book, Code, Terminal, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function FaqPage() {
  const categories = [
    {
      title: "Getting Started",
      icon: Book,
      questions: [
        {
          question: "How do I get an API key?",
          answer: "You can obtain an API key by signing up for a developer account in the Lattis - Nexus Developer Portal. After registration, navigate to the API Keys section to generate your key.",
          link: "/docs/authentication-setup"
        },
        {
          question: "Which SDK should I use?",
          answer: "We offer official SDKs for Python, JavaScript, and Java. Choose the SDK that best matches your development environment and requirements. All SDKs provide the same core functionality.",
          link: "/docs/sdk-libraries"
        },
        {
          question: "What are the prerequisites?",
          answer: "You'll need a developer account, an API key, and a development environment with your preferred programming language. Our SDKs require specific minimum versions: Python 3.7+, Node.js 14+, or Java 11+.",
          link: "/docs/getting-started"
        }
      ]
    },
    {
      title: "API Usage",
      icon: Code,
      questions: [
        {
          question: "What are the API rate limits?",
          answer: "Rate limits vary by plan. Free tier accounts are limited to 1000 requests per hour. Enterprise plans have higher or custom limits. You can monitor your usage in the developer dashboard.",
          link: "/docs/api-reference"
        },
        {
          question: "How do I handle API errors?",
          answer: "Our SDKs provide built-in error handling. We recommend implementing retry logic for transient errors and proper error handling for business logic errors. Check our documentation for error codes and best practices.",
          link: "/docs/api-reference#errors"
        },
        {
          question: "Is there a sandbox environment?",
          answer: "Yes, we provide a sandbox environment for testing. Use the sandbox API key prefix 'test_' for development and testing without affecting production data.",
          link: "/docs/getting-started#sandbox"
        }
      ]
    },
    {
      title: "Real-time Data",
      icon: Zap,
      questions: [
        {
          question: "How do WebSocket connections work?",
          answer: "WebSocket connections provide real-time updates for vehicle telemetry and system events. Connections are automatically managed by our SDKs with built-in reconnection handling.",
          link: "/docs/websocket-streams"
        },
        {
          question: "What's the WebSocket message format?",
          answer: "WebSocket messages use JSON format. Each message includes an event type, timestamp, and payload. Subscribe to specific event types to receive relevant updates.",
          link: "/docs/websocket-streams#message-format"
        },
        {
          question: "How do I handle connection drops?",
          answer: "Our SDKs handle connection drops automatically with exponential backoff retry logic. You can configure retry parameters and implement custom reconnection strategies if needed.",
          link: "/docs/websocket-streams#connection-handling"
        }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      questions: [
        {
          question: "How is data encrypted?",
          answer: "All data in transit is encrypted using TLS 1.3. We use industry-standard encryption for data at rest and implement additional security measures for sensitive data.",
          link: "/docs/security"
        },
        {
          question: "How should I store API keys?",
          answer: "Never store API keys in your source code or client-side applications. Use environment variables or secure secret management systems to store and access API keys.",
          link: "/docs/security#api-keys"
        },
        {
          question: "What security certifications do you have?",
          answer: "We maintain SOC 2 Type II compliance and undergo regular security audits. Our infrastructure follows industry best practices for security and data protection.",
          link: "/docs/security#compliance"
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Terminal,
      questions: [
        {
          question: "How do I get support?",
          answer: "We offer multiple support channels: documentation, community forums, email support, and premium support for enterprise customers. Check our support page for contact options.",
          link: "/support"
        },
        {
          question: "Are there example projects?",
          answer: "Yes, we provide example projects and code samples for common use cases. Visit our GitHub repository or examples documentation for reference implementations.",
          link: "/docs/examples"
        },
        {
          question: "How do I report bugs?",
          answer: "Report bugs through our GitHub issue tracker or contact support directly for critical issues. Please include reproduction steps and relevant error messages.",
          link: "/support#bug-reporting"
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about the Lattis - Nexus platform,
            API integration, and development process.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
                <div className="space-y-6">
                  {category.questions.map((qa, qaIndex) => (
                    <div key={qaIndex} className="bg-gray-900/30 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-cyan-400 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{qa.question}</h3>
                          <p className="text-gray-400 mb-4">{qa.answer}</p>
                          <Link
                            href={qa.link}
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Learn more
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-gray-300 mb-8">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/support"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Browse Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 