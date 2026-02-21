import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

interface Params {
  params: Promise<{ orderId: string }>
}

export async function PUT(request: NextRequest, context: Params) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, courierName, trackingId } = body

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "COMPLETED",
    ]

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { orderId } = await context.params
    const order = await prisma.order.findUnique({ where: { id: orderId } })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const transitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED"],
      CONFIRMED: ["PROCESSING", "SHIPPED"],
      PROCESSING: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: ["COMPLETED"],
      COMPLETED: [],
    }

    const current = order.status
    const nextAllowed = transitions[current] || []

    if (status !== current && !nextAllowed.includes(status)) {
      return NextResponse.json(
        { error: `Transition ${current} -> ${status} not allowed` },
        { status: 400 }
      )
    }

    const updateData: any = { status, updatedAt: new Date() }
    if (status === "SHIPPED") {
      updateData.shippedAt = new Date()
      updateData.courierName = courierName
      updateData.trackingId = trackingId
    }
    if (status === "DELIVERED") {
      updateData.deliveredAt = new Date()
    }
    if (status === "COMPLETED") {
      updateData.completedAt = new Date()
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order updated to ${status}`,
    })
  } catch (err) {
    console.error("Order status update error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
