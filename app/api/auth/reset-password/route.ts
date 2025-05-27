import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { successResponse, errorResponse, serverErrorResponse, validateRequiredFields } from "@/lib/utils/api-utils"
import crypto from "crypto"

// Request password reset
export async function POST(req: Request) {
  try {
    const data = await req.json()
    validateRequiredFields(data, ["email"])
    const { email } = data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // TODO: Send reset email with token
    // This would typically integrate with your email service

    return successResponse(
      { message: "Password reset instructions sent" },
      "If an account exists with that email, you will receive password reset instructions"
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// Reset password with token
export async function PATCH(req: Request) {
  try {
    const data = await req.json()
    validateRequiredFields(data, ["token", "newPassword"])
    const { token, newPassword } = data

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return errorResponse("Invalid or expired reset token", 400)
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return successResponse({ message: "Password reset successful" })
  } catch (error) {
    return serverErrorResponse(error)
  }
} 