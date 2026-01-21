import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { OTPPurpose } from "@prisma/client"
import { sendMail } from "@/lib/mail"

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  // **Security practice:** never reveal if user exists
  const user = await prisma.user.findUnique({ where: { email } })

  // Always generate OTP, even if user doesn't exist
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await prisma.emailOTP.create({
    data: {
      email,
      otp,
      purpose: OTPPurpose.RESET_PASSWORD,
      expiresAt,
    },
  })

  if (user) {
    await sendMail(
      email,
      "Reset your ASHMARK password",
      `<p>Your reset OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    )
  }

  return NextResponse.json({
    message: "If an account exists, reset instructions have been sent."
  })
}
