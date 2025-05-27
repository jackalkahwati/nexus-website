import { authenticator } from 'otplib';
import qrcode from 'qrcode';

export interface MfaSetupResult {
  secret: string;
  qrCodeUrl: string;
  recoveryCode: string;
}

export class MfaService {
  // Generate a new MFA secret for a user
  generateSecret(userIdentifier: string): string {
    const secret = authenticator.generateSecret();
    return secret;
  }

  // Generate a QR code for the MFA setup
  async generateQrCode(secret: string, userEmail: string, appName: string): Promise<string> {
    const otpauth = authenticator.keyuri(userEmail, appName, secret);
    try {
      const qrCodeDataUrl = await qrcode.toDataURL(otpauth);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  // Generate recovery codes for a user
  generateRecoveryCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = this.generateRandomCode();
      codes.push(code);
    }
    return codes;
  }

  // Generate a single recovery code
  generateRandomCode(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // Generate random code with groups of 5 characters separated by hyphens
    for (let i = 0; i < length; i++) {
      if (i > 0 && i % 5 === 0) {
        code += '-';
      }
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars.charAt(randomIndex);
    }
    
    return code;
  }

  // Complete the MFA setup for a user
  async setupMfa(userEmail: string, appName: string): Promise<MfaSetupResult> {
    const secret = this.generateSecret(userEmail);
    const qrCodeUrl = await this.generateQrCode(secret, userEmail, appName);
    const recoveryCode = this.generateRecoveryCodes(1)[0];
    
    return {
      secret,
      qrCodeUrl,
      recoveryCode
    };
  }

  // Verify a TOTP code
  verifyCode(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch (error) {
      console.error('Error verifying MFA code:', error);
      return false;
    }
  }
}