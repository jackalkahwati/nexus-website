import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { MFASetup } from './MFASetup'
import { MFAVerify } from './MFAVerify'

interface MFAManagementProps {
  userId: string
  initialMFAEnabled?: boolean
}

interface MFAStatus {
  enabled: boolean
  lastVerified?: string
  recoveryCodes?: string[]
}

export function MFAManagement({ userId, initialMFAEnabled = false }: MFAManagementProps) {
  const [status, setStatus] = useState<MFAStatus>({ enabled: initialMFAEnabled })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSetup, setShowSetup] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)

  // Fetch current MFA status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/auth/mfa/status')
        const data = await response.json()
        
        if (data.error) throw new Error(data.error)
        setStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch MFA status')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
  }, [])

  // Handle enabling MFA
  const handleEnableMFA = () => {
    setShowSetup(true)
  }

  // Handle disabling MFA
  const handleDisableMFA = async () => {
    setShowVerify(true)
  }

  // Handle MFA setup completion
  const handleSetupComplete = async (verified: boolean) => {
    if (verified) {
      setStatus(prev => ({ ...prev, enabled: true }))
      setShowSetup(false)
      // Show recovery codes after successful setup
      const response = await fetch('/api/auth/mfa/recovery-codes')
      const data = await response.json()
      if (!data.error) {
        setStatus(prev => ({ ...prev, recoveryCodes: data.codes }))
        setShowRecoveryCodes(true)
      }
    }
  }

  // Handle MFA verification for disabling
  const handleVerifyComplete = async (verified: boolean) => {
    if (verified) {
      try {
        const response = await fetch('/api/auth/mfa/disable', {
          method: 'POST',
        })
        const data = await response.json()
        
        if (data.error) throw new Error(data.error)
        setStatus(prev => ({ ...prev, enabled: false }))
        setShowVerify(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to disable MFA')
      }
    }
  }

  // Generate new recovery codes
  const handleGenerateNewCodes = async () => {
    try {
      const response = await fetch('/api/auth/mfa/recovery-codes/regenerate', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.error) throw new Error(data.error)
      setStatus(prev => ({ ...prev, recoveryCodes: data.codes }))
      setShowRecoveryCodes(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate new recovery codes')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Secure your account with two-factor authentication
              </CardDescription>
            </div>
            <Badge variant={status.enabled ? 'default' : 'secondary'}>
              {status.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {status.enabled ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication is enabled for your account.
                  {status.lastVerified && ` Last verified ${new Date(status.lastVerified).toLocaleDateString()}`}
                </p>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerateNewCodes}
                  >
                    Generate New Recovery Codes
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDisableMFA}
                  >
                    Disable 2FA
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Protect your account with two-factor authentication. You'll need to enter a code from your authenticator app when signing in.
                </p>
                <Button onClick={handleEnableMFA}>
                  Enable 2FA
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {showSetup && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <MFASetup
            onComplete={handleSetupComplete}
            onCancel={() => setShowSetup(false)}
          />
        </div>
      )}

      {showVerify && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <MFAVerify
            onVerify={handleVerifyComplete}
            onCancel={() => setShowVerify(false)}
          />
        </div>
      )}

      {showRecoveryCodes && status.recoveryCodes && (
        <Card>
          <CardHeader>
            <CardTitle>Recovery Codes</CardTitle>
            <CardDescription>
              Save these recovery codes in a secure place. You can use them to access your account if you lose your authenticator device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md space-y-2">
              {status.recoveryCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm">
                  {code}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Each code can only be used once. Store them securely and never share them with anyone.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowRecoveryCodes(false)}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
