import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendMail } from "@/lib/mail"
import { OTPPurpose } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success for security reasons (avoid account enumeration)
    if (!user) {
      return NextResponse.json({ message: "OTP sent if account exists" })
    }

    // Generate OTP
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

    await sendMail(
      email,
      "Reset your ASHMARK password",
      `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`
    )

    return NextResponse.json({ message: "OTP sent" })
  } catch (err) {
    console.error("OTP ERROR:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
