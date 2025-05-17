import { PrismaClient } from '@prisma/client';
import { AuthDatabase, AuthUser, UserCredentials } from './auth-service';
import { compare, hash } from 'bcryptjs';
import { authenticator } from 'otplib';

// Implementation of the AuthDatabase interface using Prisma
export class PrismaAuthDatabase implements AuthDatabase {
  private prisma: PrismaClient;
  
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  // Find a user by email
  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        hashedPassword: true,
        mfaEnabled: true,
        mfaSecret: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      hashedPassword: user.hashedPassword || undefined,
      mfaEnabled: user.mfaEnabled,
      mfaSecret: user.mfaSecret || undefined,
    };
  }

  // Validate user credentials
  async validateUser(credentials: UserCredentials): Promise<AuthUser | null> {
    const { email, password } = credentials;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        hashedPassword: true,
        mfaEnabled: true,
        mfaSecret: true,
      },
    });

    if (!user || !user.hashedPassword) return null;

    const isPasswordValid = await compare(password, user.hashedPassword);
    if (!isPasswordValid) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      mfaEnabled: user.mfaEnabled,
      mfaSecret: user.mfaSecret || undefined,
    };
  }

  // Create a new user
  async createUser(userData: Partial<AuthUser> & { password: string }): Promise<AuthUser> {
    const hashedPassword = await hash(userData.password, 12);

    const newUser = await this.prisma.user.create({
      data: {
        email: userData.email!,
        name: userData.name || null,
        image: userData.image || null,
        hashedPassword,
        mfaEnabled: userData.mfaEnabled || false,
        mfaSecret: userData.mfaSecret || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        mfaEnabled: true,
        mfaSecret: true,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      image: newUser.image,
      mfaEnabled: newUser.mfaEnabled,
      mfaSecret: newUser.mfaSecret || undefined,
    };
  }

  // Update user data
  async updateUser(id: string, data: Partial<AuthUser>): Promise<AuthUser> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
        mfaEnabled: data.mfaEnabled,
        mfaSecret: data.mfaSecret,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        mfaEnabled: true,
        mfaSecret: true,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      image: updatedUser.image,
      mfaEnabled: updatedUser.mfaEnabled,
      mfaSecret: updatedUser.mfaSecret || undefined,
    };
  }

  // Verify MFA code
  async verifyMfa(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        mfaEnabled: true,
        mfaSecret: true,
      },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return false;
    }

    // Use otplib to verify the TOTP code
    try {
      return authenticator.verify({
        token: code,
        secret: user.mfaSecret,
      });
    } catch (error) {
      console.error('MFA verification error:', error);
      return false;
    }
  }
}