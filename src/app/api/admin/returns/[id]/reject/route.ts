import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { adminNote } = await req.json()

  const request = await prisma.returnRequest.findUnique({
    where: { id }
  })

  if (!request)
    return NextResponse.json({ error: "Request not found" }, { status: 404 })

  await prisma.returnRequest.update({
    where: { id },
    data: { status: "REJECTED", adminNote }
  })

  await prisma.order.update({
    where: { id: request.orderId },
    data: { returnStatus: "REJECTED" }
  })

  return NextResponse.json({ success: true })
}
