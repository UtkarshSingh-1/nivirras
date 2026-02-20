import { Hero } from "@/components/candle-ui/Hero";
import { FeaturedCandles } from "@/components/candle-ui/FeaturedCandles";
import { Categories } from "@/components/candle-ui/Categories";
import { About } from "@/components/candle-ui/About";
import { Testimonials } from "@/components/candle-ui/Testimonials";
import { Newsletter } from "@/components/candle-ui/Newsletter";
import { getFeaturedProducts } from "@/lib/server-data";

export const revalidate = 300

export default async function HomePage() {
  let featuredProducts: Array<any> = [];

  try {
    featuredProducts = await getFeaturedProducts()
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
