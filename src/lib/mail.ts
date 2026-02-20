import nodemailer from "nodemailer";

const mailPort = Number(process.env.MAIL_PORT ?? 587);
const mailSecure =
  process.env.MAIL_SECURE !== undefined
    ? process.env.MAIL_SECURE === "true"
    : mailPort === 465;

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: mailPort,
  secure: mailSecure,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const fromAddress = process.env.MAIL_FROM || process.env.MAIL_USER || "no-reply@example.com";
const fromName = process.env.MAIL_FROM_NAME || "ASHMARK Support";

export async function sendMail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string
) {
  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}
