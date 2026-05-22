import { UltimateHome } from "../components/candle-ui/UltimateHome";
import { getFeaturedProducts, getTrendingProducts } from "../lib/server-data";

export const revalidate = 300;

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

    return <UltimateHome featuredProducts={featuredProducts} trendingProducts={trendingProducts} />;
}
