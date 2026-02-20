"use client";

import { motion } from "motion/react";
import { Flame, Heart } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  slug: string;
  category: { name: string };
}

export function FeaturedCandles({ products }: { products: Product[] }) {
  // If no products, we can either return null or show a placeholder. 
  // For now, let's return null if empty to avoid broken layout.
  if (!products || products.length === 0) return null;

  return (
    <section id="shop" className="py-24 px-6 bg-gradient-to-b from-[#FAF8F5] to-[#F5EFE7]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-5xl md:text-6xl mb-4 text-[#4A3F35]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Featured Collection
          </h2>
          <p
            className="text-lg text-[#6B5743] max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Discover our handpicked selection of premium artisan candles, each crafted with care and infused with luxurious fragrances
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <CandleCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CandleCard({ product, index }: { product: Product; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Dynamic gradient based on index or random for now, since DB doesn't have it
  const colors = [
    "from-[#F5E6D3] to-[#E8DFD4]",
    "from-[#E8DFD4] to-[#D4C4B0]",
    "from-[#FAF8F5] to-[#F5EFE7]",
    "from-[#FFF8E7] to-[#F5EFE7]"
  ];
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`}>
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${color} p-6 shadow-lg backdrop-blur-sm border border-white/50 h-full flex flex-col`}
        >
          {/* Glow Effect on Hover */}
          <motion.div
            animate={{
              opacity: isHovered ? 0.6 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-radial from-[#FFD700]/30 via-[#FFA500]/20 to-transparent blur-2xl"
          />

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorited(!isFavorited)
            }}
            className="absolute top-8 right-8 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-[#8B6F47]"
                }`}
            />
          </motion.button>

          {/* Candle Image */}
          <div className="relative mb-6 rounded-2xl overflow-hidden aspect-square">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              {/* Use standard img for now to match frontend style broadly, or Next Image if preferred. 
                  Frontend used standard img. */}
              <img
                src={product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </motion.div>

            {/* Flame Glow on Hover */}
            <motion.div
              animate={{
                opacity: isHovered ? 0.8 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.4 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-radial from-[#FFD700] via-[#FFA500] to-transparent rounded-full blur-xl"
            />
          </div>

          {/* Product Info */}
          <div className="relative z-10 mt-auto">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3
                  className="text-2xl text-[#4A3F35] mb-1 line-clamp-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#8B6F47]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Flame className="w-4 h-4" />
                  <span>{product.category.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span
                className="text-2xl text-[#8B6F47]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {formatPrice(product.price)}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-[#8B6F47] to-[#C9A66B] text-white rounded-full text-sm shadow-md"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                View
              </motion.button>
            </div>
          </div>

          {/* Soft Shadow on Hover */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            className="absolute inset-0 shadow-2xl rounded-3xl pointer-events-none"
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
