import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Building2, Users, Globe, BarChart3, Award, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">AI-Powered Fleet Intelligence</Badge>
          <h1 className="text-5xl font-bold mb-6">
            About Lattis
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pioneering the future of autonomous fleet management and smart mobility solutions through innovation, sustainability, and excellence.
          </p>
        </div>

        {/* Company Overview */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Company Overview</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2020, Lattis has rapidly emerged as a leader in fleet management technology. Operating in over 50 countries, we partner with major automotive manufacturers and fleet operators to revolutionize how vehicle fleets are managed and optimized.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">10K+</h3>
                <p className="text-sm text-muted-foreground">Active Vehicles</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">99.9%</h3>
                <p className="text-sm text-muted-foreground">Platform Uptime</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">50+</h3>
                <p className="text-sm text-muted-foreground">Countries Served</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To revolutionize fleet management through cutting-edge autonomous technology, making transportation more efficient, sustainable, and accessible for businesses worldwide.
            </p>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To be the global leader in autonomous fleet management, driving innovation and sustainability in the transportation industry.
            </p>
          </Card>
        </div>

        {/* Leadership Principles */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Leadership Principles</h2>
            <p className="text-lg text-muted-foreground">Guiding values that drive our innovation and success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <Rocket className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Innovation First</h3>
              <p className="text-muted-foreground">Continuously pushing boundaries in autonomous technology and AI solutions.</p>
            </Card>
            <Card className="p-6">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Customer Success</h3>
              <p className="text-muted-foreground">Dedicated to delivering exceptional value and support to our clients.</p>
            </Card>
            <Card className="p-6">
              <Globe className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Sustainable Impact</h3>
              <p className="text-muted-foreground">Committed to environmental responsibility and sustainable practices.</p>
            </Card>
          </div>
        </div>

        {/* Global Impact */}
        <div className="mb-16">
          <Card className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Global Impact</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Environmental Benefits</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>30% reduction in fleet emissions</li>
                  <li>25% improvement in fuel efficiency</li>
                  <li>40% decrease in idle time</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Operational Excellence</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>45% cost reduction in fleet operations</li>
                  <li>60% improvement in route efficiency</li>
                  <li>35% decrease in maintenance costs</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Latest News */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Latest News</h2>
            <p className="text-lg text-muted-foreground">Recent updates and milestones</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <Badge className="mb-4">Funding</Badge>
              <h3 className="text-xl font-bold mb-2">Series B Funding Round</h3>
              <p className="text-muted-foreground mb-4">Successfully raised $50M to accelerate global expansion and product development.</p>
              <Button variant="outline">Read More</Button>
            </Card>
            <Card className="p-6">
              <Badge className="mb-4">Partnership</Badge>
              <h3 className="text-xl font-bold mb-2">Strategic Alliance</h3>
              <p className="text-muted-foreground mb-4">New partnership with leading automotive manufacturer to enhance autonomous capabilities.</p>
              <Button variant="outline">Read More</Button>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Interested in learning more about Lattis? We'd love to hear from you.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">Request Demo</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
