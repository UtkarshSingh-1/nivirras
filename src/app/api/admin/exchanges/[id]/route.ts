import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status, adminNote } = await req.json()

  const updated = await prisma.exchangeRequest.update({
    where: { id },
    data: {
      status,
      adminNote,
    },
  })

  return NextResponse.json(updated)
}
