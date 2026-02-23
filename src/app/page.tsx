import { FeaturedCandles } from "@/components/candle-ui/FeaturedCandles";
import { Categories } from "@/components/candle-ui/Categories";
import { About } from "@/components/candle-ui/About";
import { Testimonials } from "@/components/candle-ui/Testimonials";
import { Newsletter } from "@/components/candle-ui/Newsletter";
import { getFeaturedProducts, getTrendingProducts } from "@/lib/server-data";
import { HomeHero } from "@/components/candle-ui/HomeHero";
import { TrendingCandles } from "@/components/candle-ui/TrendingCandles";

export const revalidate = 300

export default async function HomePage() {
  let featuredProducts: Array<any> = [];
  let trendingProducts: Array<any> = [];

  try {
    const [featured, trending] = await Promise.all([
      getFeaturedProducts(),
      getTrendingProducts(),
    ])
    featuredProducts = featured
    trendingProducts = trending
  } catch (e) {
    console.error("Database connection error:", e);
  }

  if (featuredProducts.length === 0 && trendingProducts.length > 0) {
    featuredProducts = trendingProducts
  }

  return (
    <div className="bg-[#F2F4E8] overflow-x-hidden">
      <HomeHero />
      <FeaturedCandles products={featuredProducts} />
      <TrendingCandles products={trendingProducts} />
      <Categories />
      <About />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
