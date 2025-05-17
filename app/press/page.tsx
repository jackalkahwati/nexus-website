'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Download,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
  ChevronRight,
  ExternalLink,
  Globe,
  Award,
  TrendingUp
} from 'lucide-react'

type TabType = 'news' | 'press-releases' | 'media-resources'

export default function PressPage() {
  const [activeTab, setActiveTab] = useState<TabType>('news')

  const pressReleases = [
    {
      date: "February 15, 2024",
      title: "Lattis - Nexus Announces Series C Funding Round of $150M",
      description: "Investment to accelerate global expansion and product development in autonomous fleet management.",
      category: "Company News"
    },
    {
      date: "January 30, 2024",
      title: "Partnership with Leading Automotive Manufacturer",
      description: "Strategic partnership to integrate Lattis - Nexus technology in next-generation autonomous vehicles.",
      category: "Partnerships"
    },
    {
      date: "January 15, 2024",
      title: "Launch of Advanced Edge Computing Platform",
      description: "New platform enables real-time decision making and enhanced fleet performance.",
      category: "Product Launch"
    },
    {
      date: "December 20, 2023",
      title: "Expansion into European Market",
      description: "Opening of London office to serve growing European customer base.",
      category: "Expansion"
    }
  ]

  const newsArticles = [
    {
      source: "TechCrunch",
      date: "February 16, 2024",
      title: "Lattis - Nexus Raises $150M to Revolutionize Fleet Management",
      link: "#"
    },
    {
      source: "Forbes",
      date: "February 1, 2024",
      title: "The Future of Autonomous Fleet Management: Lattis - Nexus Leading the Way",
      link: "#"
    },
    {
      source: "Reuters",
      date: "January 31, 2024",
      title: "Major Automotive Partnership Signals Industry Shift to Autonomous Solutions",
      link: "#"
    },
    {
      source: "Bloomberg",
      date: "January 16, 2024",
      title: "Edge Computing: The Next Frontier in Fleet Management",
      link: "#"
    }
  ]

  const awards = [
    {
      year: "2024",
      title: "Most Innovative Company in Transportation",
      organization: "Fast Company"
    },
    {
      year: "2023",
      title: "Top 50 AI Companies",
      organization: "Forbes"
    },
    {
      year: "2023",
      title: "Technology Pioneer",
      organization: "World Economic Forum"
    }
  ]

  const mediaResources = [
    {
      type: "Logo Pack",
      format: "AI, PNG, SVG",
      size: "15 MB",
      icon: <ImageIcon className="w-5 h-5" />
    },
    {
      type: "Brand Guidelines",
      format: "PDF",
      size: "5 MB",
      icon: <FileText className="w-5 h-5" />
    },
    {
      type: "Product Images",
      format: "JPG, PNG",
      size: "50 MB",
      icon: <ImageIcon className="w-5 h-5" />
    },
    {
      type: "Company Fact Sheet",
      format: "PDF",
      size: "2 MB",
      icon: <FileText className="w-5 h-5" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Press & Media
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Latest news, press releases, and media resources from Lattis - Nexus.
          </p>
        </div>

        {/* Press Contact */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Press Contact</h2>
            <p className="text-gray-300 mb-6">
              For press inquiries, please contact our media relations team.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="mailto:press@lattis-nexus.com"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                Contact Press Team
              </a>
              <a
                href="#media-kit"
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Download Media Kit
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-4 border-b border-gray-800">
            {['news', 'press-releases', 'media-resources'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {/* News Articles */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              {newsArticles.map((article, index) => (
                <a
                  key={index}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Globe className="w-4 h-4" />
                        {article.source}
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Press Releases */}
          {activeTab === 'press-releases' && (
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    {release.date}
                    <span className="mx-2">•</span>
                    <span className="px-2 py-1 bg-gray-900/50 rounded-lg">
                      {release.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{release.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{release.description}</p>
                  <a
                    href="#"
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                  >
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Media Resources */}
          {activeTab === 'media-resources' && (
            <div>
              {/* Awards Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Awards & Recognition</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {awards.map((award, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                      <Award className="w-8 h-8 text-cyan-400 mb-4" />
                      <div className="text-sm text-cyan-400 mb-2">{award.year}</div>
                      <h3 className="font-semibold mb-2">{award.title}</h3>
                      <p className="text-sm text-gray-400">{award.organization}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloads Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Downloads</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {mediaResources.map((resource, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-900/50 flex items-center justify-center text-cyan-400">
                            {resource.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                              {resource.type}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {resource.format} • {resource.size}
                            </p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Latest Metrics */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Latest Metrics
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  number: "500+",
                  label: "Enterprise Clients"
                },
                {
                  number: "30+",
                  label: "Countries"
                },
                {
                  number: "50,000+",
                  label: "Connected Vehicles"
                },
                {
                  number: "$200M+",
                  label: "Total Funding"
                }
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{metric.number}</div>
                  <div className="text-sm text-gray-300">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 