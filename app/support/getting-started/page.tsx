"use client"

import { Card } from "@/components/ui/card"

export default function GettingStartedPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-8">
        <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
        <p className="text-lg mb-6">
          Welcome to Lattis support! This guide will help you get started quickly with our next-generation fleet management platform.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Installation</h2>
          <p className="mb-4">
            To install the application, run the following command:
          </p>
          <pre className="bg-muted p-4 rounded">
            <code>npm install</code>
          </pre>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Configuration</h2>
          <p className="mb-4">
            Configure your environment by creating or editing your <code>.env.local</code> file with the appropriate variables (for example, your Mapbox token, Prisma configuration, etc.).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Running the Application</h2>
          <p className="mb-4">
            To start the development server, run:
          </p>
          <pre className="bg-muted p-4 rounded">
            <code>npm run dev</code>
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Next Steps</h2>
          <p className="mb-4">
            After setting up, explore the dashboard and support sections for additional guidance. For more detailed documentation, please visit the API Documentation page.
          </p>
        </section>
      </Card>
    </div>
  );
} 