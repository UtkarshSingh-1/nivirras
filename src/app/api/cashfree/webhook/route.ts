import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree"

async function syncPromoUsage(orderId: string, userId: string, promoCode?: string | null) {
  if (!promoCode) return

  const existingUsage = await prisma.promoCodeUsage.findUnique({
    where: { orderId },
  })

  if (!existingUsage) {
    await prisma.promoCodeUsage.create({
      data: {
        code: promoCode,
        userId,
        orderId,
      },
    })
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get("x-webhook-signature")
  const timestamp = request.headers.get("x-webhook-timestamp")

  if (
    !verifyCashfreeWebhookSignature({
      payload,
      timestamp,
      signature,
    })
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const body = JSON.parse(payload || "{}")
  const type = body?.type as string | undefined
  const merchantOrderId = body?.data?.order?.order_id as string | undefined
  const cfPaymentId = body?.data?.payment?.cf_payment_id as string | undefined
  const paymentStatus = body?.data?.payment?.payment_status as string | undefined

  if (!merchantOrderId) {
    return NextResponse.json({ success: true })
  }

  const order = await prisma.order.findUnique({
    where: { id: merchantOrderId },
  })

  if (!order) {
    return NextResponse.json({ success: true })
  }

  try {
    if (type === "PAYMENT_SUCCESS_WEBHOOK" || paymentStatus === "SUCCESS") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          razorpayPaymentId: cfPaymentId || order.razorpayPaymentId,
          paymentMethod: "PREPAID",
          paymentStatus: "PAID",
          status: order.status === "PENDING" ? "CONFIRMED" : order.status,
          updatedAt: new Date(),
        },
      })

      await syncPromoUsage(order.id, order.userId, order.promoCode)
      return NextResponse.json({ success: true })
    }

    if (
      type === "PAYMENT_FAILED_WEBHOOK" ||
      type === "PAYMENT_USER_DROPPED_WEBHOOK" ||
      ["FAILED", "USER_DROPPED", "CANCELLED", "VOID"].includes(paymentStatus || "")
    ) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          razorpayPaymentId: cfPaymentId || order.razorpayPaymentId,
          paymentStatus: "FAILED",
          updatedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cashfree webhook error:", error)
    return NextResponse.json({ error: "Webhook failure" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Cashfree webhook is active" })
}
