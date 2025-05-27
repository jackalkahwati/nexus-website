'use client'

import { ArrowRight, Github, MessageSquare, Users, Book, Code, Star, GitBranch, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CommunityPage() {
  const communityResources = [
    {
      title: "Developer Forum",
      description: "Connect with other developers, share knowledge, and get help from the community",
      icon: MessageSquare,
      link: "/community/forum",
      stats: {
        members: "10,000+",
        topics: "5,000+",
        replies: "25,000+"
      }
    },
    {
      title: "GitHub",
      description: "Explore our open-source projects, contribute code, and report issues",
      icon: Github,
      link: "https://github.com/lattis-nexus",
      stats: {
        repos: "50+",
        contributors: "200+",
        stars: "1,000+"
      }
    },
    {
      title: "Discord",
      description: "Join our real-time chat community for instant help and discussions",
      icon: MessageSquare,
      link: "/discord",
      stats: {
        members: "5,000+",
        channels: "20+",
        messages: "100,000+"
      }
    }
  ]

  const featuredProjects = [
    {
      title: "Fleet Management SDK",
      description: "Official SDK for fleet management and vehicle telemetry",
      language: "Python",
      stars: 450,
      forks: 120
    },
    {
      title: "Real-time Dashboard",
      description: "Real-time vehicle monitoring dashboard template",
      language: "JavaScript",
      stars: 380,
      forks: 95
    },
    {
      title: "Edge Computing Tools",
      description: "Tools and utilities for edge computing integration",
      language: "Go",
      stars: 320,
      forks: 85
    }
  ]

  const communityEvents = [
    {
      title: "Monthly Developer Meetup",
      description: "Virtual meetup to discuss latest features and best practices",
      date: "Last Thursday of every month",
      link: "/events/meetup"
    },
    {
      title: "Quarterly Hackathon",
      description: "Build innovative solutions using the Lattis - Nexus platform",
      date: "Every quarter",
      link: "/events/hackathon"
    },
    {
      title: "Tech Talks",
      description: "Expert talks on autonomous vehicle technology and fleet management",
      date: "Bi-weekly",
      link: "/events/talks"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Developer Community
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join our vibrant community of developers building the future of autonomous
            fleet management. Share, learn, and grow together.
          </p>
        </div>

        {/* Community Resources */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Community Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {communityResources.map((resource, index) => (
              <Link
                key={index}
                href={resource.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <resource.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-400 mb-6">{resource.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(resource.stats).map(([key, value], statIndex) => (
                    <div key={statIndex}>
                      <div className="text-lg font-semibold text-cyan-400">{value}</div>
                      <div className="text-sm text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>{project.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    <span>{project.forks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Events */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8">Community Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {communityEvents.map((event, index) => (
              <Link
                key={index}
                href={event.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <div className="flex items-center justify-between text-gray-500">
                  <span>{event.date}</span>
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Get Involved */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
            <p className="text-gray-300 mb-8">
              Ready to join our community? Get started by joining our Discord server
              or contributing to our open-source projects.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/discord"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                Join Discord
              </Link>
              <Link
                href="https://github.com/lattis-nexus"
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                View GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 