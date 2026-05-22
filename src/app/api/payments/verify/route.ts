import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { cashfreeRequest, isCashfreeConfigured } from "@/lib/cashfree"

type CashfreeFetchedOrder = {
  cf_order_id?: string
  order_id: string
  order_status: string
}

type CashfreeOrderPayment = {
  cf_payment_id: string
  payment_status: string
  payment_message?: string
  payment_time?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const orderId = body.orderId

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing payment verification details" },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, alreadyVerified: true })
    }

    if (!isCashfreeConfigured()) {
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 500 }
      )
    }

    const [cashfreeOrder, payments] = await Promise.all([
      cashfreeRequest<CashfreeFetchedOrder>(`/orders/${order.id}`),
      cashfreeRequest<CashfreeOrderPayment[]>(`/orders/${order.id}/payments`),
    ])

    const successfulPayment = payments.find(
      (payment) => payment.payment_status === "SUCCESS"
    )

    const latestPayment = [...payments].sort((a, b) =>
      (b.payment_time || "").localeCompare(a.payment_time || "")
    )[0]

    const isPaid =
      cashfreeOrder.order_status === "PAID" ||
      successfulPayment?.payment_status === "SUCCESS"

    const isFailed =
      !isPaid &&
      ["FAILED", "CANCELLED", "VOID"].includes(
        latestPayment?.payment_status || ""
      )

    await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayOrderId: cashfreeOrder.cf_order_id || order.razorpayOrderId,
        razorpayPaymentId:
          successfulPayment?.cf_payment_id ||
          latestPayment?.cf_payment_id ||
          order.razorpayPaymentId,
        paymentMethod: isPaid ? "PREPAID" : order.paymentMethod,
        paymentStatus: isPaid ? "PAID" : isFailed ? "FAILED" : "PENDING",
        status: isPaid && order.status === "PENDING" ? "CONFIRMED" : order.status,
        updatedAt: new Date(),
      },
    })

    if (isPaid && order.promoCode) {
      const existingUsage = await prisma.promoCodeUsage.findUnique({
        where: { orderId },
      })

      if (!existingUsage) {
        await prisma.promoCodeUsage.create({
          data: {
            code: order.promoCode,
            userId: order.userId,
            orderId: order.id,
          },
        })
      }
    }

    if (isPaid) {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })
    }

    return NextResponse.json({
      success: isPaid,
      paymentStatus: isPaid ? "PAID" : isFailed ? "FAILED" : "PENDING",
      orderStatus: cashfreeOrder.order_status,
      paymentMessage: latestPayment?.payment_message,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
