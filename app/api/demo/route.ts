import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { emailService } from '@/lib/services/email';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const demoSignupSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s-']+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes"),
  workEmail: z.string()
    .email("Please enter a valid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"),
  company: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s-'&.]+$/, "Company name can only contain letters, numbers, spaces, hyphens, apostrophes, ampersands, and periods"),
});

const demoRequestSchema = z.object({
  fullName: z.string().min(2).max(100),
  workEmail: z.string().email(),
  company: z.string().min(2).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = demoRequestSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.workEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await hash(tempPassword, 12);

    // Create demo user with demo role
    const demoRole = await prisma.role.upsert({
      where: { name: 'DEMO' },
      update: {},
      create: { name: 'DEMO' }
    });

    const user = await prisma.user.create({
      data: {
        name: validatedData.fullName,
        email: validatedData.workEmail,
        hashedPassword,
        roleId: demoRole.id,
      }
    });

    // Store demo request for tracking
    await prisma.demoRequest.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.workEmail,
        company: validatedData.company,
        status: 'APPROVED',
      },
    });

    // Return credentials for immediate login
    return NextResponse.json({
      message: 'Demo account created successfully',
      credentials: {
        email: validatedData.workEmail,
        password: tempPassword
      }
    });

  } catch (error) {
    console.error('Demo request error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process demo request' },
      { status: 500 }
    );
  }
}
