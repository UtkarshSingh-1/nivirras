import { prisma } from "@/lib/db"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductSort } from "./product-sort"

interface ProductGridProps {
  searchParams: {
    search?: string
    category?: string
    page?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    featured?: string
    trending?: string
  }
  showHeader?: boolean
}

export async function ProductGrid({ searchParams, showHeader = true }: ProductGridProps) {
  const sp = searchParams
  const page = parseInt(sp.page || '1')
  const limit = 12
  const search = sp.search
  const category = sp.category
  const minPrice = sp.minPrice
  const maxPrice = sp.maxPrice
  const featured = sp.featured
  const trending = sp.trending
  const sort = sp.sort || 'createdAt'
  const order = 'desc'
  const isTrending = sp.trending === "true"

  const skip = (page - 1) * limit

  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  if (featured === "true") {
    where.featured = true
  }

  if (trending === "true") {
    where.trending = true
  }

  const orderBy: any = {}
  orderBy[sort] = order

  let products: any[] = []
  let total = 0

  try {
    const [productsResult, totalResult] = await Promise.all([
      prisma.product.findMany({
        where,
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
            select: { name: true, slug: true }
          }
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    const productIds = productsResult.map((product) => product.id)
    const ratingGroups = productIds.length
      ? await prisma.review.groupBy({
          by: ["productId"],
          where: { productId: { in: productIds } },
          _avg: { rating: true },
          _count: { _all: true },
        })
      : []
    const ratingMap = new Map(
      ratingGroups.map((group) => [
        group.productId,
        {
          averageRating: group._avg.rating ?? 0,
          reviewCount: group._count._all ?? 0,
        },
      ])
    )

    products = productsResult.map((product) => {
      const ratings = ratingMap.get(product.id) ?? { averageRating: 0, reviewCount: 0 }
      return {
        ...product,
        averageRating: ratings.averageRating,
        reviewCount: ratings.reviewCount,
      }
    })
    total = totalResult
  } catch (error) {
    // If database is unreachable, render empty state
    console.error('[ProductGrid] Database error:', error)
    products = []
    total = 0
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className={isTrending ? "text-3xl font-bold text-[#7A5A45]" : "text-2xl font-bold"}
              style={isTrending ? { fontFamily: "'Cormorant Garamond', serif" } : undefined}
            >
              {search ? `Search Results for "${search}"` : isTrending ? "Customer Favourites" : "All Products"}
            </h1>
            <p className="text-muted-foreground">
              {isTrending ? "Most-loved picks from our customers." : `Showing ${products.length} of ${total} products`}
            </p>
          </div>

          <div className={isTrending ? "hidden sm:block" : ""}>
            <ProductSort value={sort} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              price: Number(product.price),
              comparePrice: product.comparePrice ? Number(product.comparePrice) : null
            }}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {page > 1 && (
            <Button variant="outline" asChild>
              <Link href={`?${(() => { const params = new URLSearchParams(); Object.entries(sp).forEach(([k, v]) => { if (typeof v === 'string') params.set(k, v) }); params.set('page', (page - 1).toString()); return params.toString() })()}`}>
                Previous
              </Link>
            </Button>
          )}

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          {page < totalPages && (
            <Button variant="outline" asChild>
              <Link href={`?${(() => { const params = new URLSearchParams(); Object.entries(sp).forEach(([k, v]) => { if (typeof v === 'string') params.set(k, v) }); params.set('page', (page + 1).toString()); return params.toString() })()}`}>
                Next
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
