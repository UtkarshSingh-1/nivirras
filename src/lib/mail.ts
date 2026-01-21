import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT), // 465
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: true
  }
})

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"ASHMARK Support" <${process.env.MAIL_FROM}>`,
    to,
    subject,
    html
  })
}
