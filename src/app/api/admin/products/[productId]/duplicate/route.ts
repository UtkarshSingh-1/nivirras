import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { jsonToStringArray } from "@/lib/utils"
import { revalidateTag } from "next/cache"

function makeDuplicateSlug(slug: string) {
  return `${slug}-copy-${Date.now()}`
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await context.params
    const source = await prisma.product.findUnique({ where: { id: productId } })

    if (!source) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const duplicate = await prisma.product.create({
      data: {
        name: `${source.name} (Copy)`,
        slug: makeDuplicateSlug(source.slug),
        description: source.description,
        price: source.price,
        comparePrice: source.comparePrice,
        images: jsonToStringArray(source.images),
        sizes: jsonToStringArray(source.sizes),
        colors: jsonToStringArray(source.colors),
        stock: source.stock,
        featured: false,
        trending: false,
        storyTitle: source.storyTitle,
        storyContent: source.storyContent,
        storyImages: jsonToStringArray(source.storyImages),
        categoryId: source.categoryId,
      },
      select: { id: true },
    })

    revalidateTag("products")
    return NextResponse.json({ success: true, productId: duplicate.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to duplicate product" }, { status: 500 })
  }
}
