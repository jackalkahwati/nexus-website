'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { 
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Send,
  Building,
  Clock
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const offices = [
    {
      city: "San Francisco",
      country: "United States",
      address: "123 Tech Street, CA 94105",
      phone: "+1 (555) 123-4567",
      email: "sf@lattis-nexus.com",
      hours: "9:00 AM - 6:00 PM PST"
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "456 Innovation Way, EC2A 1AB",
      phone: "+44 20 7123 4567",
      email: "london@lattis-nexus.com",
      hours: "9:00 AM - 6:00 PM GMT"
    },
    {
      city: "Singapore",
      country: "Singapore",
      address: "789 Smart Boulevard, 018956",
      phone: "+65 6789 0123",
      email: "singapore@lattis-nexus.com",
      hours: "9:00 AM - 6:00 PM SGT"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help with your fleet management needs.
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Email Support",
                description: "Get help via email",
                action: "support@lattis-nexus.com",
                link: "mailto:support@lattis-nexus.com"
              },
              {
                icon: <Phone className="w-6 h-6" />,
                title: "Phone Support",
                description: "Talk to our team",
                action: "+1 (555) 123-4567",
                link: "tel:+15551234567"
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Live Chat",
                description: "Chat with support",
                action: "Start Chat",
                link: "#chat"
              }
            ].map((option, index) => (
              <a
                key={index}
                href={option.link}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-400">{option.description}</p>
                    <p className="text-sm text-cyan-400 mt-1">{option.action}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-gray-100"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Office Locations */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Our Offices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{office.city}</h3>
                    <p className="text-sm text-gray-400">{office.country}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-1 text-gray-400" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-1 text-gray-400" />
                    <span>{office.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 mt-1 text-gray-400" />
                    <span>{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 