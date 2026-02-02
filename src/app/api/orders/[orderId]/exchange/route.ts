import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId } = await params
  const body = await req.json()

  const {
    reason,
    oldSize,
    newSize,
    oldColor,
    newColor,
  } = body

  const exchange = await prisma.exchangeRequest.create({
    data: {
      orderId,
      userId: session.user.id,
      reason,
      oldSize,
      newSize,
      oldColor,
      newColor,
      status: "REQUESTED",
    },
  })

  return NextResponse.json({
    success: true,
    exchangeId: exchange.id,
  })
}
