import { compare, hash } from 'bcryptjs';
import type { User, Session } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define models for authentication
export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  hashedPassword?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface MfaVerification {
  token: string;
  code: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Database interface that can be implemented by different database providers
export interface AuthDatabase {
  findUserByEmail(email: string): Promise<AuthUser | null>;
  validateUser(credentials: UserCredentials): Promise<AuthUser | null>;
  createUser(userData: Partial<AuthUser> & { password: string }): Promise<AuthUser>;
  updateUser(id: string, data: Partial<AuthUser>): Promise<AuthUser>;
  verifyMfa(userId: string, code: string): Promise<boolean>;
}

// Auth Service class
export class AuthService {
  private database: AuthDatabase;

  constructor(database: AuthDatabase) {
    this.database = database;
  }

  // Password hashing function
  async hashPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }

  // Password verification function
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  // Login function
  async login(credentials: UserCredentials): Promise<AuthResult> {
    try {
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Invalid credentials' };
      }

      const user = await this.database.validateUser(credentials);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Handle MFA if enabled
      if (user.mfaEnabled) {
        return { 
          success: true, 
          user: {
            id: user.id,
            name: user.name || null,
            email: user.email,
            image: user.image || null,
            mfaRequired: true
          } as User
        };
      }

      return { 
        success: true, 
        user: {
          id: user.id,
          name: user.name || null,
          email: user.email,
          image: user.image || null
        } as User
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Verify MFA token
  async verifyMfaToken(verification: MfaVerification): Promise<AuthResult> {
    try {
      // Parse the token to get the user ID
      // In a real implementation, you would validate a JWT or session token
      const userId = verification.token;
      
      const isValid = await this.database.verifyMfa(userId, verification.code);
      
      if (!isValid) {
        return { success: false, error: 'Invalid MFA code' };
      }

      const user = await this.database.findUserByEmail(userId);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return { 
        success: true, 
        user: {
          id: user.id,
          name: user.name || null,
          email: user.email,
          image: user.image || null
        } as User
      };
    } catch (error) {
      console.error('MFA verification error:', error);
      return { success: false, error: 'MFA verification failed' };
    }
  }

  // Configure NextAuth options
  getNextAuthOptions(database: AuthDatabase): NextAuthOptions {
    return {
      session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      pages: {
        signIn: '/auth/login',
        error: '/auth/error',
      },
      providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error('Invalid credentials');
            }

            const authResult = await this.login({
              email: credentials.email,
              password: credentials.password,
            });

            if (!authResult.success || !authResult.user) {
              throw new Error(authResult.error || 'Authentication failed');
            }

            return authResult.user;
          },
        }),
      ],
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.picture = user.image;
            // Add custom claims if needed
            token.mfaRequired = (user as any).mfaRequired;
          }
          return token;
        },
        async session({ session, token }) {
          if (session.user && token) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string | null;
            session.user.image = token.picture as string | null;
            // Add custom session properties if needed
            (session as any).mfaRequired = token.mfaRequired;
          }
          return session;
        },
      },
    };
  }
}