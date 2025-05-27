'use client'

import { MessageSquare, Users, Code, Book, Shield, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DiscordPage() {
  const channels = [
    {
      name: "general",
      description: "General discussion about Lattis - Nexus",
      icon: MessageSquare,
      category: "Community"
    },
    {
      name: "help",
      description: "Get help with technical questions",
      icon: Code,
      category: "Support"
    },
    {
      name: "announcements",
      description: "Latest updates and announcements",
      icon: Zap,
      category: "Updates"
    },
    {
      name: "showcase",
      description: "Share your projects and implementations",
      icon: Book,
      category: "Community"
    }
  ]

  const guidelines = [
    {
      title: "Be Respectful",
      description: "Treat all members with respect and courtesy",
      icon: Users
    },
    {
      title: "Stay On Topic",
      description: "Keep discussions relevant to Lattis - Nexus and development",
      icon: MessageSquare
    },
    {
      title: "No Spam",
      description: "Avoid excessive self-promotion or spam",
      icon: Shield
    }
  ]

  const benefits = [
    {
      title: "Real-time Support",
      description: "Get instant help from community members and maintainers",
      features: [
        "Direct access to developers",
        "Quick problem resolution",
        "Community knowledge sharing"
      ]
    },
    {
      title: "Networking",
      description: "Connect with other developers and industry professionals",
      features: [
        "Meet like-minded developers",
        "Share experiences",
        "Collaboration opportunities"
      ]
    },
    {
      title: "Early Access",
      description: "Get early access to new features and updates",
      features: [
        "Beta testing opportunities",
        "Feature previews",
        "Direct feedback channel"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Join Our Discord Community
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with developers, get help, and stay updated with the latest
            from Lattis - Nexus in our Discord community.
          </p>
          <div className="mt-8">
            <Link
              href="https://discord.gg/lattis-nexus"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Join Discord Server
            </Link>
          </div>
        </div>

        {/* Channels */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Channels</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {channels.map((channel, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <channel.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{channel.category}</div>
                    <h3 className="font-semibold">#{channel.name}</h3>
                  </div>
                </div>
                <p className="text-gray-400">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Community Guidelines</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {guidelines.map((guideline, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <guideline.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{guideline.title}</h3>
                </div>
                <p className="text-gray-400">{guideline.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Community Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-400 mb-6">{benefit.description}</p>
                <ul className="space-y-3">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Join Now */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
            <p className="text-gray-300 mb-8">
              Join our growing community of developers and be part of the
              conversation. Get help, share knowledge, and connect with others.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="https://discord.gg/lattis-nexus"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                Join Discord
              </Link>
              <Link
                href="/docs/community"
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 