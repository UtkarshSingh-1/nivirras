import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { OrderStatus } from "@prisma/client"

/**
 * Admin dashboard order statistics
 * - totalOrders
 * - cancelledOrders
 * - issueOrders (failed payments / cancelled)
 */

export async function GET() {
  try {
    // Explicit mutable array (❗ fixes readonly + enum errors)
    const issueOrderStatuses: OrderStatus[] = ["CANCELLED"]

    const [
      totalOrders,
      cancelledOrders,
      issueOrders,
    ] = await Promise.all([
      prisma.order.count(),

      prisma.order.count({
        where: {
          status: "CANCELLED",
        },
      }),

      prisma.order.count({
        where: {
          OR: [
            { paymentStatus: "FAILED" },
            {
              status: {
                in: issueOrderStatuses, // ✅ FIXED
              },
            },
          ],
        },
      }),
    ])

    return NextResponse.json({
      totalOrders,
      cancelledOrders,
      issueOrders,
    })
  } catch (error) {
    console.error("Admin order stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch order statistics" },
      { status: 500 }
    )
  }
}
