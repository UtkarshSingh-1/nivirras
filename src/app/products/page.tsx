import { Suspense } from "react"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileFilters } from "@/components/product/mobile-filters"
import { getPublicCategories } from "@/lib/server-data"

export const revalidate = 300

interface SearchParamsShape {
  search?: string
  category?: string
  page?: string
  sort?: string
  minPrice?: string
  maxPrice?: string
  featured?: string
  trending?: string
}

export default async function ProductsPage(
  props: { searchParams: Promise<Record<string, string | string[] | undefined>> }
) {
  const raw = await props.searchParams
  const pick = (k: string) => Array.isArray(raw[k]) ? (raw[k] as string[])[0] : (raw[k] as string | undefined)
  const params: SearchParamsShape = {
    search: pick('search'),
    category: pick('category'),
    page: pick('page'),
    sort: pick('sort'),
    minPrice: pick('minPrice'),
    maxPrice: pick('maxPrice'),
    featured: pick('featured'),
    trending: pick('trending'),
  }
  const categories = await getPublicCategories()

  return (
    <div className="min-h-screen bg-[#F2F4E8] pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Our Collection
          </h1>
          <p className="text-[#4A5422] mt-2">Handcrafted candles for every mood and moment.</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <MobileFilters initialCategories={categories} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            <ProductFilters initialCategories={categories} />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

