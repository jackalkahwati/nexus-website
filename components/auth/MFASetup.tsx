import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Alert, AlertDescription } from '../ui/alert'
import { Label } from '../ui/label'
import Image from 'next/image'

interface MFASetupProps {
  onComplete: (verified: boolean) => void
  onCancel: () => void
}

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [step, setStep] = useState<'qr' | 'verify'>('qr')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)

  // Fetch MFA setup data
  const setupMFA = async () => {
    try {
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setQrCode(data.qrCode)
      setSecret(data.secret)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup MFA')
    }
  }

  // Verify MFA token
  const verifyMFA = async () => {
    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: verificationCode,
          secret,
        }),
      })
      const data = await response.json()
      
      if (data.error) throw new Error(data.error)
      if (data.verified) {
        onComplete(true)
      } else {
        setError('Invalid verification code')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    }
  }

  // Initialize MFA setup on mount
  useState(() => {
    setupMFA()
  })

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Setup Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enhance your account security with two-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'qr' && qrCode && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src={qrCode}
                  alt="QR Code for MFA setup"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app
              </p>
              {secret && (
                <p className="text-xs text-muted-foreground">
                  Manual entry code: {secret}
                </p>
              )}
            </div>
            <Button
              className="w-full"
              onClick={() => setStep('verify')}
            >
              Next
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button
              className="w-full"
              onClick={verifyMFA}
              disabled={verificationCode.length !== 6}
            >
              Verify
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
