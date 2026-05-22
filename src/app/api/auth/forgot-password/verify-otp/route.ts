import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { OTPPurpose } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json()

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, OTP and password are required" },
        { status: 400 }
      )
    }

    const record = await prisma.emailOTP.findFirst({
      where: { email, purpose: OTPPurpose.RESET_PASSWORD },
      orderBy: { createdAt: "desc" },
    })

    if (!record) return NextResponse.json({ error: "OTP not found" }, { status: 400 })
    if (record.otp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    if (record.expiresAt < new Date()) return NextResponse.json({ error: "OTP expired" }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (err) {
    console.error("RESET ERROR:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
