import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

/* ------------------------------- GET ------------------------------- */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const exchange = await prisma.exchangeRequest.findUnique({
    where: { id },
    include: {
      user: true,
      order: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  })

  if (!exchange) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(exchange)
}

/* ------------------------------ PATCH ------------------------------ */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await req.json()

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const exchange = await prisma.exchangeRequest.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json({ success: true, exchange })
}
