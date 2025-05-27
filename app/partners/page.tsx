'use client'

import { useState } from 'react'
import { 
  Users,
  Code,
  Building2,
  Globe,
  ChevronRight,
  Award,
  Zap,
  Shield,
  Settings,
  MessageSquare,
  BookOpen
} from 'lucide-react'

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState('technology')

  const partnerPrograms = [
    {
      type: "Technology Partners",
      description: "Integrate your solutions with our platform",
      benefits: [
        "API access and technical support",
        "Joint product development",
        "Co-marketing opportunities",
        "Partner portal access"
      ],
      icon: <Code className="w-6 h-6" />
    },
    {
      type: "Solution Partners",
      description: "Implement and customize our solutions",
      benefits: [
        "Implementation training",
        "Sales enablement",
        "Partner certification",
        "Lead sharing"
      ],
      icon: <Building2 className="w-6 h-6" />
    },
    {
      type: "Strategic Partners",
      description: "Long-term strategic collaborations",
      benefits: [
        "Executive sponsorship",
        "Product roadmap input",
        "Early access to features",
        "Joint go-to-market"
      ],
      icon: <Users className="w-6 h-6" />
    }
  ]

  const featuredPartners = [
    {
      name: "AutoTech Solutions",
      type: "Technology Partner",
      description: "Leading provider of autonomous vehicle systems",
      logo: "🚗"
    },
    {
      name: "FleetWise Systems",
      type: "Solution Partner",
      description: "Enterprise fleet management solutions",
      logo: "🚛"
    },
    {
      name: "SmartCity Innovations",
      type: "Strategic Partner",
      description: "Smart city infrastructure and solutions",
      logo: "🏙️"
    },
    {
      name: "DataFlow Analytics",
      type: "Technology Partner",
      description: "Real-time data processing and analytics",
      logo: "📊"
    },
    {
      name: "MobilityTech Corp",
      type: "Solution Partner",
      description: "Mobility solutions and consulting",
      logo: "🚌"
    },
    {
      name: "EdgeCompute Systems",
      type: "Technology Partner",
      description: "Edge computing infrastructure provider",
      logo: "💻"
    }
  ]

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Access to worldwide customer base and markets"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Partner Recognition",
      description: "Awards and certifications program"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Technical Support",
      description: "Dedicated partner support and resources"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Partner Protection",
      description: "Deal registration and territory protection"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Integration Tools",
      description: "APIs, SDKs, and development resources"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Community Access",
      description: "Partner community and collaboration"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Partner with Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join our ecosystem of technology and solution partners to drive innovation
            in autonomous fleet management.
          </p>
        </div>

        {/* Partner Programs */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Partner Programs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {partnerPrograms.map((program, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white mb-4">
                  {program.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{program.type}</h3>
                <p className="text-gray-300 text-sm mb-4">{program.description}</p>
                <ul className="space-y-2">
                  {program.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-400">
                      <ChevronRight className="w-4 h-4 mr-2 text-cyan-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Partners */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Partners</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPartners.map((partner, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h3 className="text-lg font-semibold mb-1">{partner.name}</h3>
                <div className="text-sm text-cyan-400 mb-2">{partner.type}</div>
                <p className="text-gray-300 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Benefits */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Partner Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="text-cyan-400 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Partner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Become a Partner</h2>
                <p className="text-gray-300 mb-6">
                  Join our partner ecosystem and help shape the future of autonomous
                  fleet management. We're looking for innovative companies to collaborate with.
                </p>
                <div className="flex gap-4">
                  <a
                    href="/apply"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
                  >
                    Apply Now
                  </a>
                  <a
                    href="/contact"
                    className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
              <div>
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Partner Program Guide",
                      "Technical Documentation",
                      "Integration Tutorials",
                      "Partner Success Stories"
                    ].map((resource, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 mr-2" />
                          {resource}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 