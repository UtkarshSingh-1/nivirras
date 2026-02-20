"use client";

import { motion } from "motion/react";
import { Sparkles, Leaf, Moon, Sun } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Floral Bliss",
    description: "Delicate floral scents",
    icon: Sparkles,
    color: "from-[#FFE5E5] to-[#FFF0F5]",
    count: "12 candles",
  },
  {
    id: 2,
    name: "Earthy Calm",
    description: "Grounding natural aromas",
    icon: Leaf,
    color: "from-[#E8F5E9] to-[#F1F8E9]",
    count: "8 candles",
  },
  {
    id: 3,
    name: "Evening Serenity",
    description: "Relaxing night scents",
    icon: Moon,
    color: "from-[#E3F2FD] to-[#F3E5F5]",
    count: "10 candles",
  },
  {
    id: 4,
    name: "Morning Refresh",
    description: "Energizing citrus notes",
    icon: Sun,
    color: "from-[#FFF9C4] to-[#FFECB3]",
    count: "6 candles",
  },
];

export function Categories() {
  return (
    <section id="scents" className="py-24 px-6 bg-gradient-to-b from-[#F5EFE7] to-[#FAF8F5]">
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
            Scent Categories
          </h2>
          <p
            className="text-lg text-[#6B5743] max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Explore our curated fragrance families, each designed to evoke a unique mood and atmosphere
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const Icon = category.icon;
  const slug = category.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Link href={`/products?category=${slug}`}>
        <div
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${category.color} p-8 shadow-lg backdrop-blur-sm border border-white/50 h-full transition-all duration-300 hover:shadow-2xl`}
        >
          {/* Icon Circle */}
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-white/70 rounded-full flex items-center justify-center mb-6 shadow-md backdrop-blur-sm"
          >
            <Icon className="w-8 h-8 text-[#8B6F47]" />
          </motion.div>

          {/* Category Info */}
          <h3
            className="text-3xl text-[#4A3F35] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {category.name}
          </h3>
          <p
            className="text-[#6B5743] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span
              className="text-sm text-[#8B6F47]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {category.count}
            </span>
            <motion.div
              whileHover={{ x: 5 }}
              className="text-[#8B6F47]"
            >
              →
            </motion.div>
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-radial from-[#C9A66B]/40 to-transparent blur-xl"
          />
        </div>
      </Link>
    </motion.div>
  );
}
