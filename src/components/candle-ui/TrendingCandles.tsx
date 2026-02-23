import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  slug: string;
  featured: boolean;
  trending: boolean;
  averageRating?: number;
  reviewCount?: number;
  category: { name: string };
}

export function TrendingCandles({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section id="trending" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#F2F4E8] to-[#E8ECD6]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#636B2F]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Customer Favourites
          </h2>
          <p className="text-[#4A5422] mt-2">
            Most-loved picks from our customers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <LandingCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products?trending=true"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#636B2F] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4A5422] sm:w-auto"
          >
            View Trending
          </Link>
          <Link
            href="/products"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-[#D3DAAE] bg-white px-6 py-3 text-sm font-medium text-[#4A5422] transition-colors hover:border-[#636B2F] hover:bg-[#EDF1DB] sm:w-auto"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingCard({ product }: { product: Product }) {
  const image = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : "/placeholder-product.jpg";
  const showSale = product.comparePrice && product.comparePrice > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="rounded-3xl border border-[#E4E0D6] bg-white p-3 shadow-sm transition-shadow group-hover:shadow-md">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F5F2EA]">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover"
          />
          {showSale && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#7A5A45] shadow-sm">
              Sale
            </span>
          )}
        </div>

        <div className="pt-3">
          <h3 className="line-clamp-2 text-[13px] font-medium text-[#2F2A24]">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-col gap-1 text-[#2F2A24]">
            <span className="text-[15px] font-semibold">{formatPrice(product.price)}</span>
            {showSale && (
              <span className="text-xs text-[#8A6A55] line-through">
                {formatPrice(product.comparePrice as number)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
