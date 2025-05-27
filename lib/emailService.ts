import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailTemplate {
  subject: string
  body: string
}

const templates = {
  alert: (data: any): EmailTemplate => ({
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

  maintenance: (data: any): EmailTemplate => ({
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

  performance: (data: any): EmailTemplate => ({
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

  system: (data: any): EmailTemplate => ({
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

export async function sendNotificationEmail(
  to: string,
  type: keyof typeof templates,
  data: any
) {
  try {
    const template = templates[type](data)
    
    const response = await resend.emails.send({
      from: 'Lattis Fleet <notifications@lattis.com>',
      to,
      subject: template.subject,
      html: template.body,
    })

    return { success: true, messageId: response.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendBatchNotificationEmails(
  recipients: string[],
  type: keyof typeof templates,
  data: any
) {
  try {
    const template = templates[type](data)
    
    const response = await resend.batch.send(
      recipients.map(to => ({
        from: 'Lattis Fleet <notifications@lattis.com>',
        to,
        subject: template.subject,
        html: template.body,
      }))
    )

    return { success: true, results: response }
  } catch (error) {
    console.error('Error sending batch emails:', error)
    return { success: false, error }
  }
} 