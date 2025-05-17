import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import Handlebars from 'handlebars'
import { readFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { ReactElement } from 'react'
import type { Prisma } from '@prisma/client'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  templateId?: string
  templateData?: Record<string, any>
  react?: ReactElement
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

interface DbEmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
  createdAt: Date
  updatedAt: Date
}

const notificationTemplates = {
  alert: (data: any) => ({
    subject: `🚨 Alert: ${data.title}`,
    body: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">${data.title}</h2>
        <p style="color: #374151;">${data.description}</p>
        <div style="margin-top: 24px; padding: 16px; background-color: #fee2e2; border-radius: 8px;">
          <p style="color: #991b1b; margin: 0;">Priority: High</p>
          <p style="color: #991b1b; margin: 8px 0 0 0;">Immediate action required</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/notifications" 
           style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          View Details
        </a>
      </div>
    `,
  }),

  maintenance: (data: any) => ({
    subject: `🔧 Maintenance Required: ${data.title}`,
    body: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">${data.title}</h2>
        <p style="color: #374151;">${data.description}</p>
        <div style="margin-top: 24px; padding: 16px; background-color: #fef3c7; border-radius: 8px;">
          <p style="color: #92400e; margin: 0;">Scheduled Maintenance</p>
          <p style="color: #92400e; margin: 8px 0 0 0;">Please review and schedule accordingly</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fleet" 
           style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          View Fleet Status
        </a>
      </div>
    `,
  }),

  performance: (data: any) => ({
    subject: `📊 Performance Update: ${data.title}`,
    body: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">${data.title}</h2>
        <p style="color: #374151;">${data.description}</p>
        <div style="margin-top: 24px; padding: 16px; background-color: #d1fae5; border-radius: 8px;">
          <p style="color: #065f46; margin: 0;">Performance Metrics</p>
          <p style="color: #065f46; margin: 8px 0 0 0;">Review your fleet's performance</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics" 
           style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          View Analytics
        </a>
      </div>
    `,
  }),

  system: (data: any) => ({
    subject: `ℹ️ System Update: ${data.title}`,
    body: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${data.title}</h2>
        <p style="color: #374151;">${data.description}</p>
        <div style="margin-top: 24px; padding: 16px; background-color: #dbeafe; border-radius: 8px;">
          <p style="color: #1e40af; margin: 0;">System Information</p>
          <p style="color: #1e40af; margin: 8px 0 0 0;">Please review these updates</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings" 
           style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
          View Settings
        </a>
      </div>
    `,
  }),
}

export class EmailService {
  private transporter: nodemailer.Transporter
  private resend: Resend
  private templates: Map<string, EmailTemplate>

  constructor() {
    // Initialize Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Initialize Resend client as backup provider
    this.resend = new Resend(process.env.RESEND_API_KEY)
    
    // Initialize templates map
    this.templates = new Map()
    this.loadTemplates()
  }

  private async loadTemplates() {
    try {
      // Load templates from database
      const dbTemplates = await prisma.emailTemplate.findMany()
      dbTemplates.forEach((template: DbEmailTemplate) => {
        this.templates.set(template.id, {
          id: template.id,
          name: template.name,
          subject: template.subject,
          body: template.body,
          variables: template.variables,
        })
      })
    } catch (error) {
      console.error('Error loading email templates:', error)
    }
  }

  private async compileTemplate(templateId: string, data: Record<string, any>) {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    const compiler = Handlebars.compile(template.body)
    return {
      subject: template.subject,
      html: compiler(data),
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      let emailContent: { subject: string; html?: string; text?: string }

      if (options.templateId) {
        emailContent = await this.compileTemplate(
          options.templateId,
          options.templateData || {}
        )
      } else {
        emailContent = {
          subject: options.subject,
          html: options.html,
          text: options.text,
        }
      }

      // Try primary provider (Nodemailer)
      try {
        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: Array.isArray(options.to) ? options.to.join(',') : options.to,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          attachments: options.attachments,
        })
        return true
      } catch (error) {
        console.error('Primary email provider failed:', error)

        // Fallback to Resend
        await this.resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          react: options.react,
        })
        return true
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }

  async sendNotificationEmail(
    to: string,
    type: keyof typeof notificationTemplates,
    data: any
  ) {
    const template = notificationTemplates[type](data)
    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.body,
    })
  }

  async sendBatchNotificationEmails(
    recipients: string[],
    type: keyof typeof notificationTemplates,
    data: any
  ) {
    const template = notificationTemplates[type](data)
    const results = await Promise.all(
      recipients.map(to =>
        this.sendEmail({
          to,
          subject: template.subject,
          html: template.body,
        })
      )
    )
    return results.every(result => result)
  }

  async createTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    const dbTemplate = await prisma.emailTemplate.create({
      data: {
        name: template.name,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
      },
    })

    const newTemplate = {
      id: dbTemplate.id,
      name: dbTemplate.name,
      subject: dbTemplate.subject,
      body: dbTemplate.body,
      variables: dbTemplate.variables,
    }

    this.templates.set(dbTemplate.id, newTemplate)
    return newTemplate
  }

  async updateTemplate(
    id: string,
    template: Partial<Omit<EmailTemplate, 'id'>>
  ): Promise<EmailTemplate> {
    const dbTemplate = await prisma.emailTemplate.update({
      where: { id },
      data: template,
    })

    const updatedTemplate = {
      id: dbTemplate.id,
      name: dbTemplate.name,
      subject: dbTemplate.subject,
      body: dbTemplate.body,
      variables: dbTemplate.variables,
    }

    this.templates.set(id, updatedTemplate)
    return updatedTemplate
  }

  async deleteTemplate(id: string): Promise<void> {
    await prisma.emailTemplate.delete({ where: { id } })
    this.templates.delete(id)
  }

  async getTemplate(id: string): Promise<EmailTemplate | null> {
    return this.templates.get(id) || null
  }

  async listTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.templates.values())
  }
}

// Export a singleton instance
export const emailService = new EmailService()
