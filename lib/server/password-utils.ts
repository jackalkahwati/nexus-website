import crypto from 'crypto';

export function generateServerPassword(length: number = 12): string {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';
  let password = '';
  
  while (password.length < length) {
    const byte = crypto.randomBytes(1)[0];
    const position = byte % charset.length;
    password += charset[position];
  }
  
  return password;
} 