import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/db"

export const CACHE_REVALIDATE_SECONDS = 300

type ProductSelect = {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string[]
  featured: boolean
  trending: boolean
  category: { name: string }
}

function normalizeProduct(product: any): ProductSelect {
  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    images: Array.isArray(product.images)
      ? product.images.filter((item: unknown): item is string => typeof item === "string")
      : [],
  }
}

export const getFeaturedProducts = unstable_cache(
  async () => {
    const featuredRaw = await prisma.product.findMany({
      where: { featured: true },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
        featured: true,
        trending: true,
        category: {
          select: { name: true },
        },
      },
    })

    if (featuredRaw.length > 0) {
      return featuredRaw.map(normalizeProduct)
    }

    const fallbackRaw = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
        featured: true,
        trending: true,
        category: {
          select: { name: true },
        },
      },
    })

    return fallbackRaw.map(normalizeProduct)
  },
  ["featured-products"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] }
)

export async function getCachedProductBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
        },
      }),
    [`product-by-slug-${slug}`],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] }
  )()
}

export const getProductSlugs = unstable_cache(
  async () => prisma.product.findMany({ select: { slug: true } }),
  ["product-slugs"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] }
)

export const getPublicCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ["public-categories"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["categories"] }
)
