import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { OTPPurpose } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body?.password === "string" ? body.password : ""
    const otp = typeof body?.otp === "string" ? body.otp.trim() : ""

    if (!name || !email || !password || !otp) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const record = await prisma.emailOTP.findFirst({
      where: { email, purpose: OTPPurpose.VERIFY_EMAIL },
      orderBy: { createdAt: "desc" }
    })

    if (!record) return NextResponse.json({ error: "OTP not found" }, { status: 400 })
    if (record.otp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    if (record.expiresAt < new Date()) return NextResponse.json({ error: "OTP expired" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true },
    })

    await prisma.emailOTP.deleteMany({
      where: {
        email,
        purpose: OTPPurpose.VERIFY_EMAIL,
      },
    })

    return NextResponse.json({ message: "User verified & created", user }, { status: 201 })
  } catch (error) {
    console.error("verify-otp error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
