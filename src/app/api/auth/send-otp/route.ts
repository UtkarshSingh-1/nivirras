import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { OTPPurpose } from "@prisma/client"
import { sendMail } from "@/lib/mail"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await prisma.emailOTP.create({
      data: {
        email,
        otp,
        purpose: OTPPurpose.VERIFY_EMAIL,
        expiresAt,
      }
    })

    // ⛑ protect against transporter exceptions
    await sendMail(
      email,
      "Verify your ASHMARK account",
      `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    )

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("OTP Error:", error)
    return NextResponse.json(
      { error: "Failed to send OTP. Try again later." },
      { status: 500 }
    )
  }
}
