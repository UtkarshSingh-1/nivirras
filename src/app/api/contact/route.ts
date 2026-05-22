import { NextRequest, NextResponse } from "next/server"
import { sendMail } from "@/lib/mail"

interface ContactPayload {
  firstName?: string
  lastName?: string
  email?: string
  subject?: string
  message?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload

    const firstName = body.firstName?.trim() ?? ""
    const lastName = body.lastName?.trim() ?? ""
    const email = body.email?.trim().toLowerCase() ?? ""
    const subject = body.subject?.trim() ?? ""
    const message = body.message?.trim() ?? ""

    if (!firstName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "First name, email, subject, and message are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    const supportEmail =
      process.env.MAIL_TO_SUPPORT || process.env.MAIL_FROM || process.env.MAIL_USER

    if (!supportEmail) {
      return NextResponse.json({ error: "Support email is not configured." }, { status: 500 })
    }

    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />")
    const safeSubject = escapeHtml(subject)
    const safeFirstName = escapeHtml(firstName)
    const safeLastName = escapeHtml(lastName)

    await sendMail(
      supportEmail,
      `Contact: ${safeSubject}`,
      `
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${safeFirstName} ${safeLastName}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Subject:</b> ${safeSubject}</p>
      <p><b>Message:</b><br />${safeMessage}</p>
      `,
      email
    )

    return NextResponse.json({ message: "Message sent successfully." })
  } catch (error) {
    console.error("CONTACT_API_ERROR", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
