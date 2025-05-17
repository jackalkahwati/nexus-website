"use client"

import { Card } from "@/components/ui/card"

export default function ApiDocumentationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-8">
        <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
        <p className="text-lg mb-6">
          This document describes the available API endpoints and how to use them.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Export API</h2>
          <p className="mb-4">
            The Export API allows you to start and monitor data exports.
          </p>
          <div className="space-y-2">
            <div className="p-4 bg-muted rounded">
              <code className="text-sm">POST /api/export</code>
              <p className="mt-2 text-sm text-muted-foreground">Start an export job</p>
            </div>
            <div className="p-4 bg-muted rounded">
              <code className="text-sm">GET /api/export?jobId=&lt;jobId&gt;</code>
              <p className="mt-2 text-sm text-muted-foreground">Retrieve export job status</p>
            </div>
            <div className="p-4 bg-muted rounded">
              <code className="text-sm">GET /api/export/jobs</code>
              <p className="mt-2 text-sm text-muted-foreground">List all export jobs</p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Import API</h2>
          <p className="mb-4">
            The Import API allows you to start and monitor data imports.
          </p>
          <div className="space-y-2">
            <div className="p-4 bg-muted rounded">
              <code className="text-sm">POST /api/import</code>
              <p className="mt-2 text-sm text-muted-foreground">Start an import job</p>
            </div>
            <div className="p-4 bg-muted rounded">
              <code className="text-sm">GET /api/import?jobId=&lt;jobId&gt;</code>
              <p className="mt-2 text-sm text-muted-foreground">Retrieve import job status</p>
            </div>
            <div className="p-4 bg-muted rounded">
              <code className="text-sm">GET /api/import/jobs</code>
              <p className="mt-2 text-sm text-muted-foreground">List all import jobs</p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Payment API</h2>
          <p className="mb-4">
            The Payment API integrates with our Prisma client to handle payment intents.
          </p>
          <div className="space-y-2">
            <div className="p-4 bg-muted rounded">
              <code className="text-sm">POST /api/payment/intent</code>
              <p className="mt-2 text-sm text-muted-foreground">Create a payment intent</p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-muted-foreground">
            For more detailed technical specifications and usage examples, please refer to our full documentation or contact support.
          </p>
        </section>
      </Card>
    </div>
  );
} 