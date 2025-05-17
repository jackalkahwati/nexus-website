'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Book,
  HelpCircle,
  ChevronRight
} from 'lucide-react'

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    {
      title: "Getting Started",
      icon: <Book className="w-5 h-5" />,
      articles: [
        "Platform Overview",
        "Quick Start Guide",
        "Account Setup",
        "First Fleet Integration"
      ]
    },
    {
      title: "API Documentation",
      icon: <FileText className="w-5 h-5" />,
      articles: [
        "Authentication",
        "API Endpoints",
        "Rate Limits",
        "Error Handling"
      ]
    },
    {
      title: "Common Issues",
      icon: <HelpCircle className="w-5 h-5" />,
      articles: [
        "Connection Troubleshooting",
        "Data Sync Issues",
        "Performance Optimization",
        "Error Resolution"
      ]
    }
  ]

  const faqs = [
    {
      question: "How do I integrate my fleet with Lattis - Nexus?",
      answer: "Integration can be done through our REST API or SDK libraries. Follow our Quick Start Guide for step-by-step instructions."
    },
    {
      question: "What security measures are in place?",
      answer: "We implement enterprise-grade security including end-to-end encryption, MFA, and regular security audits."
    },
    {
      question: "How is billing calculated?",
      answer: "Billing is based on fleet size and feature usage. Contact our sales team for detailed pricing information."
    },
    {
      question: "What support options are available?",
      answer: "We offer 24/7 technical support, dedicated account managers, and comprehensive documentation."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Support Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get help with Lattis - Nexus platform. Find answers, documentation, and support resources.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/30 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Live Chat",
                description: "Chat with our support team",
                icon: <MessageCircle className="w-6 h-6" />,
                link: "#chat"
              },
              {
                title: "Email Support",
                description: "Send us an email",
                icon: <Mail className="w-6 h-6" />,
                link: "mailto:support@lattis-nexus.com"
              },
              {
                title: "Phone Support",
                description: "Call our support line",
                icon: <Phone className="w-6 h-6" />,
                link: "tel:+15551234567"
              }
            ].map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-400">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Documentation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <Link
                        href={`/docs/${article.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-gray-300 mb-6">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="mailto:support@lattis-nexus.com"
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
