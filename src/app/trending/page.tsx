import { Suspense } from "react"
import { ProductGrid } from "@/components/product/product-grid"
import { Skeleton } from "@/components/ui/skeleton"

export const revalidate = 300

export default async function TrendingPage() {
  return (
    <div className="min-h-screen bg-[#F2F4E8] pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7A5A45]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Customer Favourites
          </h1>
          <p className="text-[#4A5422] mt-2">Most-loved picks from our customers.</p>
        </div>

        <Suspense fallback={<TrendingGridSkeleton />}>
          <ProductGrid searchParams={{ trending: "true" }} showHeader={false} />
        </Suspense>
      </div>
    </div>
  )
}

function TrendingGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
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
