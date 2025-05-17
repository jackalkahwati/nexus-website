'use client'

import { useState, useEffect } from 'react'
import { EmailTemplateList } from '@/components/email/EmailTemplateList'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
}

export default function EmailPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [sendEmailData, setSendEmailData] = useState({
    to: '',
    subject: '',
    body: '',
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/email/templates')
      if (!response.ok) throw new Error('Failed to fetch templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch email templates',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async (
    template: Omit<EmailTemplate, 'id'>
  ): Promise<void> => {
    try {
      const response = await fetch('/api/email/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      })
      if (!response.ok) throw new Error('Failed to create template')
      await fetchTemplates()
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  const handleUpdateTemplate = async (
    id: string,
    template: Partial<Omit<EmailTemplate, 'id'>>
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/email/templates?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      })
      if (!response.ok) throw new Error('Failed to update template')
      await fetchTemplates()
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  const handleDeleteTemplate = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/email/templates?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete template')
      await fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendEmailData),
      })
      if (!response.ok) throw new Error('Failed to send email')
      
      toast({
        title: 'Success',
        description: 'Email sent successfully',
      })
      
      setSendEmailData({
        to: '',
        subject: '',
        body: '',
      })
    } catch (error) {
      console.error('Error sending email:', error)
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Send Email</h2>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <Input
                type="email"
                value={sendEmailData.to}
                onChange={(e) =>
                  setSendEmailData({ ...sendEmailData, to: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                value={sendEmailData.subject}
                onChange={(e) =>
                  setSendEmailData({ ...sendEmailData, subject: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body</label>
              <Textarea
                value={sendEmailData.body}
                onChange={(e) =>
                  setSendEmailData({ ...sendEmailData, body: e.target.value })
                }
                rows={5}
                required
              />
            </div>
            <Button type="submit">Send Email</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Templates</h2>
          <div className="space-y-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  setSendEmailData({
                    ...sendEmailData,
                    subject: template.subject,
                    body: template.body,
                  })
                }
              >
                {template.name}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <EmailTemplateList
        templates={templates}
        onCreateTemplate={handleCreateTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  )
} 