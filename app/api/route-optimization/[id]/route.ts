import { NextResponse } from "next/server"
import { OptimizationRequest, OptimizationResult } from "@/types/route-optimization"

// In-memory storage (shared with main route file)
declare global {
  var optimizationRequests: Map<string, OptimizationRequest>
  var optimizationResults: Map<string, OptimizationResult>
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const optimizationRequest = global.optimizationRequests?.get(id)
    const optimizationResult = global.optimizationResults?.get(id)

    if (!optimizationRequest) {
      return NextResponse.json(
        { error: "Optimization request not found" },
        { status: 404 }
      )
    }

    if (optimizationRequest.status === "completed" && optimizationResult) {
      return NextResponse.json(optimizationResult)
    }

    return NextResponse.json({
      id,
      status: optimizationRequest.status,
      error: optimizationRequest.status === "failed" ? "Optimization failed" : undefined
    })
  } catch (error) {
    console.error("Error fetching optimization result:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const optimizationRequest = global.optimizationRequests?.get(id)

    if (!optimizationRequest) {
      return NextResponse.json(
        { error: "Optimization request not found" },
        { status: 404 }
      )
    }

    // Update status to failed
    optimizationRequest.status = "failed"
    optimizationRequest.updatedAt = new Date().toISOString()
    global.optimizationRequests?.set(id, optimizationRequest)

    // Remove result if exists
    global.optimizationResults?.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error canceling optimization:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 