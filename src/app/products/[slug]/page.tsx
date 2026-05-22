import { notFound } from "next/navigation"
import { ProductImages } from "@/components/product/product-images"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { ReviewSection } from "@/components/product/review-section"
import { jsonToStringArray } from "@/lib/utils"
import { getCachedProductBySlug, getProductSlugs } from "@/lib/server-data"

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let product: Awaited<ReturnType<typeof getCachedProductBySlug>> | null = null
  try {
    product = await getCachedProductBySlug(slug)
  } catch (error) {
    console.error("[ProductPage] Error loading product:", error)
    throw new Error("Failed to load product")
  }

  if (!product) {
    return notFound()
  }

  const images = jsonToStringArray(product.images)
  const sizes = jsonToStringArray(product.sizes) as string[]
  const colors = jsonToStringArray(product.colors) as string[]

  const serializedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    sizes,
    colors,
    stock: product.stock,
    featured: product.featured,
    trending: product.trending,
    category: {
      name: product.category?.name || "Uncategorized",
    },
  }

  return (
    <div className="min-h-screen pt-24 bg-[#F2F4E8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImages images={images} name={serializedProduct.name} />

          {/* Product Info */}
          <ProductInfo product={serializedProduct} />
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <ProductTabs product={serializedProduct} />
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-16">
          <ReviewSection productId={product.id} />
        </div>

        {/* Related Products */}
        <div className="mt-16 border-t pt-16">
          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </div>
      </div>
    </div>
  )
}

