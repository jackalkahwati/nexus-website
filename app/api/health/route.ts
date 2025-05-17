import { NextResponse } from 'next/server';

export async function GET() {
  // Simple health check endpoint that always returns 200 OK
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: Date.now(),
      message: 'API is running'
    },
    { status: 200 }
  );
}

// Also handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
} 