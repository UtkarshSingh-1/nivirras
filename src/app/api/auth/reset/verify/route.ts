import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { OTPPurpose } from "@prisma/client"

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json()

  if (!email || !otp) {
    return NextResponse.json({ error: "Email & OTP are required" }, { status: 400 })
  }

  const record = await prisma.emailOTP.findFirst({
    where: { email, purpose: OTPPurpose.RESET_PASSWORD },
    orderBy: { createdAt: "desc" }
  })

  if (!record) return NextResponse.json({ error: "OTP not found" }, { status: 400 })
  if (record.otp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
  if (record.expiresAt < new Date()) return NextResponse.json({ error: "OTP expired" }, { status: 400 })

  return NextResponse.json({ message: "OTP verified" })
}
