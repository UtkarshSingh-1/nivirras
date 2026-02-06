import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const reel = await prisma.reel.findUnique({
    where: { id },
    select: { mediaId: true },
  })

  await prisma.reel.delete({ where: { id } })

  if (reel?.mediaId) {
    await prisma.media.deleteMany({ where: { id: reel.mediaId } })
  }

  return NextResponse.json({ success: true })
}
