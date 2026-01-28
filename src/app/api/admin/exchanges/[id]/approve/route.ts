import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const request = await prisma.exchangeRequest.findUnique({
    where: { id },
  })

  if (!request)
    return NextResponse.json({ error: "Request not found" }, { status: 404 })

  await prisma.exchangeRequest.update({
    where: { id },
    data: { status: "APPROVED" }
  })

  await prisma.order.update({
    where: { id: request.orderId },
    data: { exchangeStatus: "APPROVED" }
  })

  return NextResponse.json({ success: true })
}
