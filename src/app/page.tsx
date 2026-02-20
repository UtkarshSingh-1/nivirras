import { prisma } from "@/lib/db";
import { Hero } from "@/components/candle-ui/Hero";
import { FeaturedCandles } from "@/components/candle-ui/FeaturedCandles";
import { Categories } from "@/components/candle-ui/Categories";
import { About } from "@/components/candle-ui/About";
import { Testimonials } from "@/components/candle-ui/Testimonials";
import { Newsletter } from "@/components/candle-ui/Newsletter";

export default async function HomePage() {
  let featuredProducts: Array<any> = [];

  // Fetch products properly
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
          select: { name: true }
        }
      }
    });

    const serialize = (p: any) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      images: Array.isArray(p.images)
        ? p.images.filter((item: unknown): item is string => typeof item === "string")
        : [],
    });

    featuredProducts = featuredRaw.map(serialize);

    // Fallback if no featured
    if (featuredProducts.length === 0) {
      const anyProducts = await prisma.product.findMany({
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
            select: { name: true }
          }
        }
      });
      featuredProducts = anyProducts.map(serialize);
    }

  } catch (e) {
    console.error("Database connection error:", e);
  }

  return (
    <div className="bg-[#FAF8F5] overflow-x-hidden">
      <Hero />
      <FeaturedCandles products={featuredProducts} />
      <Categories />
      <About />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
