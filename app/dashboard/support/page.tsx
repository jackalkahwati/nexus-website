"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Book,
  FileText,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Video,
} from "lucide-react"
import { cn } from "@/lib/cn"
import { useRouter } from "next/navigation"
import { LucideIcon } from "lucide-react"

interface SupportCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
  onClick?: () => void
  href?: string
}

function SupportCard({ title, description, icon: Icon, className, onClick, href }: SupportCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const faqs = [
  {
    question: "How do I track my deliveries?",
    answer: "You can track your deliveries in real-time through the 'Tracking' page. Each delivery has a unique ID and status that updates automatically. You can also set up notifications for status changes."
  },
  {
    question: "How do I manage my fleet?",
    answer: "Navigate to the 'Fleet' section to manage your vehicles. You can add new vehicles, track maintenance schedules, and monitor vehicle status. The dashboard provides real-time updates on vehicle locations and performance metrics."
  },
  {
    question: "How do I set up notifications?",
    answer: "Go to 'Settings' > 'Notifications' to customize your notification preferences. You can choose to receive updates via email, SMS, or push notifications for various events like delivery status changes and vehicle maintenance alerts."
  },
  {
    question: "How do I generate reports?",
    answer: "Visit the 'Analytics' section to generate custom reports. You can filter data by date range, vehicle type, or delivery status. Reports can be exported in various formats including PDF, CSV, and Excel."
  },
  {
    question: "How do I manage team access?",
    answer: "Team access can be managed in 'Settings' > 'Team'. You can invite new team members, assign roles, and set permissions. Each role has customizable access levels to different features of the platform."
  }
]

const documentationCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of using the platform",
    icon: Book,
    href: "/dashboard/support/getting-started"
  },
  {
    title: "API Documentation",
    description: "Integrate with our API",
    icon: FileText,
    href: "/dashboard/support/api-documentation"
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step guides",
    icon: Video,
    href: "/dashboard/support/video-tutorials"
  },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Support</h2>
        <p className="text-muted-foreground">
          Get help with your account and find answers to common questions.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SupportCard
          title="Contact Support"
          description="Get in touch with our support team"
          icon={LifeBuoy}
          onClick={() => {
            const supportSection = document.getElementById('contact-form')
            supportSection?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        <SupportCard
          title="Documentation"
          description="Browse our comprehensive guides"
          icon={Book}
          href="/dashboard/support/getting-started"
        />
        <SupportCard
          title="Live Chat"
          description="Chat with our support team"
          icon={MessageCircle}
          onClick={() => {
            // This would typically integrate with your chat widget
            window.alert('Live chat feature coming soon!')
          }}
        />
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card id="contact-form">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Our support team typically responds within 2 hours during business hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">support@example.com</span>
              </div>
              <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Support Status: Online</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Current response time: ~10 minutes
              </p>
            </div>

            <Separator />

            <form className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Input type="email" placeholder="Your email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="issue-type" className="text-sm text-muted-foreground">
                  Issue Type
                </label>
                <select 
                  id="issue-type"
                  name="issue-type"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select issue type</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe your issue..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-4">
                <Button className="flex-1">Send Message</Button>
                <Button variant="outline" className="flex-1">Schedule a Call</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
            <p className="text-sm text-muted-foreground">
              Common questions and answers to help you get started.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Documentation</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentationCategories.map((category, index) => (
            <SupportCard
              key={index}
              title={category.title}
              description={category.description}
              icon={category.icon}
              href={category.href}
            />
          ))}
        </div>
      </div>

      <div className="bg-muted rounded-lg p-6 mt-6">
        <div className="flex items-start space-x-4">
          <HelpCircle className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Still need help?</h3>
            <p className="text-sm text-muted-foreground">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
            <Button variant="link" className="p-0 h-auto mt-2">
              Schedule a call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 