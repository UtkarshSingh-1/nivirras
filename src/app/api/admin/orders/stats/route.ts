import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ✅ Only valid OrderStatus values
  const issueOrderStatuses = ["CANCELLED"] as const

  const [
    totalOrders,
    cancelledOrders,
    failedPayments,
    returnRequests,
    exchangeRequests,
  ] = await Promise.all([
    prisma.order.count(),

    prisma.order.count({
      where: {
        status: { in: issueOrderStatuses },
      },
    }),

    prisma.order.count({
      where: {
        paymentStatus: "FAILED",
      },
    }),

    prisma.returnRequest.count({
      where: { status: "REQUESTED" },
    }),

    prisma.exchangeRequest.count({
      where: { status: "REQUESTED" },
    }),
  ])

  return NextResponse.json({
    totalOrders,
    cancelledOrders,
    failedPayments,
    returnRequests,
    exchangeRequests,
  })
}
