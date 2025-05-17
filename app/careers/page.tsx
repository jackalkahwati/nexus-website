'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search,
  MapPin,
  Briefcase,
  Code,
  ChevronRight,
  Users,
  Rocket,
  Heart,
  Globe,
  Coffee,
  Zap
} from 'lucide-react'

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = [
    'all',
    'engineering',
    'product',
    'design',
    'operations',
    'sales',
    'marketing'
  ]

  const jobs = [
    {
      title: "Senior Autonomous Systems Engineer",
      department: "engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Lead the development of our autonomous fleet management systems."
    },
    {
      title: "Machine Learning Engineer",
      department: "engineering",
      location: "London, UK",
      type: "Full-time",
      description: "Build and optimize ML models for fleet optimization."
    },
    {
      title: "Product Manager - Fleet Solutions",
      department: "product",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Drive product strategy for our fleet management platform."
    },
    {
      title: "UX/UI Designer",
      department: "design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive interfaces for our fleet management tools."
    },
    {
      title: "Fleet Operations Specialist",
      department: "operations",
      location: "Singapore",
      type: "Full-time",
      description: "Manage and optimize fleet operations for our APAC clients."
    },
    {
      title: "Enterprise Sales Director",
      department: "sales",
      location: "New York, NY",
      type: "Full-time",
      description: "Drive enterprise sales growth in the Eastern US region."
    }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world with our distributed team."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Comprehensive Healthcare",
      description: "Full medical, dental, and vision coverage for you and your family."
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Career Growth",
      description: "Professional development budget and mentorship opportunities."
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Work-Life Balance",
      description: "Flexible hours and unlimited PTO policy."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Equity Package",
      description: "Be an owner in the company with competitive equity grants."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Latest Technology",
      description: "Access to cutting-edge tools and technologies."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Help us shape the future of autonomous fleet management and smart mobility.
            We're looking for passionate individuals to join our mission.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-900/50 text-gray-300 hover:bg-gray-900'
                  }`}
                >
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">{job.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8">Why Join Us?</h2>
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

        {/* Culture Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Our Culture</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Innovation-Driven</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We're building the future of autonomous fleet management, pushing the boundaries
                  of what's possible. Our team thrives on solving complex challenges and creating
                  innovative solutions that transform the transportation industry.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Collaborative Environment</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We believe in the power of teamwork and open communication. Our diverse team
                  brings together different perspectives and expertise to create better solutions
                  and drive meaningful impact.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Application Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Apply Online",
                  description: "Submit your application through our careers portal"
                },
                {
                  step: "2",
                  title: "Initial Review",
                  description: "Our team reviews your application and background"
                },
                {
                  step: "3",
                  title: "Interviews",
                  description: "Meet with team members and discuss your experience"
                },
                {
                  step: "4",
                  title: "Decision",
                  description: "Receive our decision and discuss next steps"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="text-cyan-400 font-bold text-lg mb-3">Step {step.step}</div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-8 h-px bg-gray-700 -mr-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
