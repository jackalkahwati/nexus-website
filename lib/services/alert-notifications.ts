import { LogStats } from '../logger'
import { emailService } from '../services/email'

interface LogFile {
  modified: Date
}

export interface AlertConfig {
  emailNotifications: boolean
  criticalThresholds: {
    diskUsage: number // percentage
    fileCount: number
    rotationFailures: number
    recoveryCodeAttempts: number // number of failed attempts before alert
    recoveryCodeUsage: number // percentage of codes used before alert
    suspiciousTimeWindow: number // minutes to check for suspicious activity
  }
  emailRecipients: string[]
  securityTeamRecipients: string[]
}

const DEFAULT_CONFIG: AlertConfig = {
  emailNotifications: true,
  criticalThresholds: {
    diskUsage: 90, // 90% disk usage
    fileCount: 1000,
    rotationFailures: 3,
    recoveryCodeAttempts: 3, // Alert after 3 failed attempts
    recoveryCodeUsage: 70, // Alert when 70% of codes are used
    suspiciousTimeWindow: 60 // Check for suspicious activity in last 60 minutes
  },
  emailRecipients: ['admin@example.com'],
  securityTeamRecipients: ['security@example.com']
}

interface RecoveryCodeStats {
  totalGenerated: number
  totalUsed: number
  failedAttempts: number
  recentAttempts: Array<{
    timestamp: Date
    success: boolean
    ip: string
    userId: string
  }>
}

class AlertNotificationService {
  private config: AlertConfig = DEFAULT_CONFIG
  private lastNotificationTime: Record<string, Date> = {}
  private readonly NOTIFICATION_COOLDOWN = 3600000 // 1 hour in milliseconds

  getConfig(): AlertConfig {
    return { ...this.config }
  }

  setConfig(newConfig: Partial<AlertConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  async checkAndNotify(stats: LogStats) {
    const criticalAlerts = this.getCriticalAlerts(stats)
    
    for (const alert of criticalAlerts) {
      await this.sendNotification(alert)
    }

    return criticalAlerts
  }

  async checkRecoveryCodes(stats: RecoveryCodeStats) {
    const alerts = this.getRecoveryCodeAlerts(stats)
    
    for (const alert of alerts) {
      await this.sendSecurityNotification(alert)
    }

    return alerts
  }

  private getRecoveryCodeAlerts(stats: RecoveryCodeStats) {
    const alerts: Array<{
      type: string
      title: string
      message: string
      severity: 'critical' | 'warning'
      details?: Record<string, any>
    }> = []

    // Check failed attempts
    if (stats.failedAttempts >= this.config.criticalThresholds.recoveryCodeAttempts) {
      alerts.push({
        type: 'recovery_code_attempts',
        title: 'Excessive Recovery Code Failures',
        message: `${stats.failedAttempts} failed recovery code attempts detected. Possible brute force attack.`,
        severity: 'critical',
        details: {
          failedAttempts: stats.failedAttempts,
          threshold: this.config.criticalThresholds.recoveryCodeAttempts
        }
      })
    }

    // Check usage rate
    const usageRate = (stats.totalUsed / stats.totalGenerated) * 100
    if (usageRate >= this.config.criticalThresholds.recoveryCodeUsage) {
      alerts.push({
        type: 'recovery_code_usage',
        title: 'High Recovery Code Usage',
        message: `${usageRate.toFixed(1)}% of recovery codes have been used. Consider generating new codes.`,
        severity: 'warning',
        details: {
          usageRate,
          totalUsed: stats.totalUsed,
          totalGenerated: stats.totalGenerated
        }
      })
    }

    // Check for suspicious patterns
    const timeWindow = this.config.criticalThresholds.suspiciousTimeWindow * 60 * 1000 // convert to ms
    const recentAttempts = stats.recentAttempts.filter(
      attempt => Date.now() - attempt.timestamp.getTime() <= timeWindow
    )

    // Check for attempts from multiple IPs
    const uniqueIPs = new Set(recentAttempts.map(a => a.ip))
    if (uniqueIPs.size > 2) {
      alerts.push({
        type: 'suspicious_ips',
        title: 'Multiple IP Recovery Code Attempts',
        message: `Recovery code attempts from ${uniqueIPs.size} different IP addresses in the last ${this.config.criticalThresholds.suspiciousTimeWindow} minutes.`,
        severity: 'critical',
        details: {
          uniqueIPs: Array.from(uniqueIPs),
          timeWindow: this.config.criticalThresholds.suspiciousTimeWindow
        }
      })
    }

    // Check for rapid successive attempts
    if (recentAttempts.length > 5) {
      alerts.push({
        type: 'rapid_attempts',
        title: 'Rapid Recovery Code Attempts',
        message: `${recentAttempts.length} recovery code attempts in the last ${this.config.criticalThresholds.suspiciousTimeWindow} minutes.`,
        severity: 'critical',
        details: {
          attemptCount: recentAttempts.length,
          timeWindow: this.config.criticalThresholds.suspiciousTimeWindow
        }
      })
    }

    return alerts
  }

  private getCriticalAlerts(stats: LogStats) {
    const alerts: Array<{
      type: string
      title: string
      message: string
      severity: 'critical' | 'warning'
    }> = []

    // Check disk usage
    const maxSize = 1024 * 1024 * 1024 // 1GB
    const usagePercent = (stats.totalSize / maxSize) * 100
    
    if (usagePercent >= this.config.criticalThresholds.diskUsage) {
      alerts.push({
        type: 'disk_usage',
        title: 'Critical Disk Usage',
        message: `Log files are using ${usagePercent.toFixed(1)}% of allocated space. Consider increasing disk space or adjusting retention policies.`,
        severity: 'critical'
      })
    }

    // Check file count
    if (stats.fileCount >= this.config.criticalThresholds.fileCount) {
      alerts.push({
        type: 'file_count',
        title: 'Excessive Log Files',
        message: `There are ${stats.fileCount} log files. High file counts may impact system performance.`,
        severity: 'critical'
      })
    }

    // Check for old files that should have been rotated
    const oldFiles = stats.files.filter((file: LogFile) => {
      const age = Date.now() - file.modified.getTime()
      return age > 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    if (oldFiles.length > 0) {
      alerts.push({
        type: 'old_files',
        title: 'Log Rotation Issue',
        message: `${oldFiles.length} log files are older than 7 days and haven't been rotated.`,
        severity: 'warning'
      })
    }

    return alerts
  }

  private async sendSecurityNotification(alert: {
    type: string
    title: string
    message: string
    severity: 'critical' | 'warning'
    details?: Record<string, any>
  }) {
    // Check cooldown
    const lastNotification = this.lastNotificationTime[alert.type]
    if (lastNotification && Date.now() - lastNotification.getTime() < this.NOTIFICATION_COOLDOWN) {
      return
    }

    // Update notification time
    this.lastNotificationTime[alert.type] = new Date()

    // Always notify security team of recovery code alerts
    if (this.config.emailNotifications) {
      try {
        const recipients = alert.severity === 'critical' 
          ? [...this.config.securityTeamRecipients, ...this.config.emailRecipients]
          : this.config.securityTeamRecipients

        await emailService.sendEmail({
          to: recipients,
          subject: `[SECURITY ALERT] ${alert.title}`,
          html: `
            <h2>${alert.title}</h2>
            <p>${alert.message}</p>
            <p>Severity: ${alert.severity}</p>
            ${alert.details ? `
              <h3>Details:</h3>
              <pre>${JSON.stringify(alert.details, null, 2)}</pre>
            ` : ''}
            <p>Time: ${new Date().toLocaleString()}</p>
            <hr>
            <p>This is an automated security alert from the SOC2 monitoring system.</p>
            <p>Please investigate immediately if this is a critical alert.</p>
          `
        })
      } catch (error) {
        console.error('Failed to send security alert email:', error)
      }
    }
  }

  private async sendNotification(alert: {
    type: string
    title: string
    message: string
    severity: 'critical' | 'warning'
  }) {
    // Check cooldown
    const lastNotification = this.lastNotificationTime[alert.type]
    if (lastNotification && Date.now() - lastNotification.getTime() < this.NOTIFICATION_COOLDOWN) {
      return
    }

    // Update notification time
    this.lastNotificationTime[alert.type] = new Date()

    // Only send email for critical alerts
    if (this.config.emailNotifications && alert.severity === 'critical') {
      try {
        await emailService.sendEmail({
          to: this.config.emailRecipients,
          subject: `[ALERT] ${alert.title}`,
          html: `
            <h2>${alert.title}</h2>
            <p>${alert.message}</p>
            <p>Time: ${new Date().toLocaleString()}</p>
            <hr>
            <p>This is an automated message from the log monitoring system.</p>
          `
        })
      } catch (error) {
        console.error('Failed to send alert email:', error)
      }
    }
  }
}

export const alertNotificationService = new AlertNotificationService()
