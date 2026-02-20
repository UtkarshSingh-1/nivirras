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

function isPrismaConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const maybeCode = (error as { code?: string }).code
  const maybeMessage = (error as { message?: string }).message
  return (
    maybeCode === "P1001" ||
    maybeCode === "P2024" ||
    (typeof maybeMessage === "string" &&
      (maybeMessage.includes("Can't reach database server") ||
        maybeMessage.includes("Timed out fetching a new connection from the connection pool")))
  )
}

export const getFeaturedProducts = unstable_cache(
  async () => {
    try {
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
    } catch (error) {
      if (isPrismaConnectionError(error)) {
        console.error("Database temporarily unreachable in getFeaturedProducts")
        return []
      }
      throw error
    }
  },
  ["featured-products"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] }
)

export async function getCachedProductBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.product.findUnique({
          where: { slug },
          include: {
            category: true,
          },
        })
      } catch (error) {
        if (isPrismaConnectionError(error)) {
          console.error("Database temporarily unreachable in getCachedProductBySlug")
          return null
        }
        throw error
      }
    },
    [`product-by-slug-${slug}`],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] }
  )()
}

export const getProductSlugs = unstable_cache(
  async () => {
    try {
      return await prisma.product.findMany({ select: { slug: true } })
    } catch (error) {
      if (isPrismaConnectionError(error)) {
        console.error("Database temporarily unreachable in getProductSlugs")
        return []
      }
      throw error
    }
  },
  ["product-slugs"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] }
)

export const getPublicCategories = unstable_cache(
  async () => {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      })
    } catch (error) {
      if (isPrismaConnectionError(error)) {
        console.error("Database temporarily unreachable in getPublicCategories")
        return []
      }
      throw error
    }
  },
  ["public-categories"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["categories"] }
)
