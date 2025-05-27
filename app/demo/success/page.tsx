"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function DemoSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Thank You for Your Interest!
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            We've received your demo request. Check your email for access instructions and next steps.
          </p>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Haven't received our email? Check your spam folder or contact our support team.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/support">Contact Support</Link>
              </Button>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 