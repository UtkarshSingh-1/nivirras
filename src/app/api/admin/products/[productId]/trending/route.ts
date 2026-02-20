import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"
import { revalidateTag } from "next/cache"

const payloadSchema = z.object({
  trending: z.boolean(),
})

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await context.params
    const { trending } = payloadSchema.parse(await request.json())

    const product = await prisma.product.update({
      where: { id: productId },
      data: { trending },
      select: { id: true, trending: true },
    })

    revalidateTag("products")
    return NextResponse.json({ success: true, product })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update trending status" }, { status: 500 })
  }
}
