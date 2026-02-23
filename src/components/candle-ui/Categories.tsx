import { Sparkles, Leaf, Moon, Sun } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Floral Bliss",
    description: "Delicate floral scents",
    icon: Sparkles,
    color: "from-[#EDF1DB] to-[#DDE4BE]",
    count: "12 candles",
  },
  {
    id: 2,
    name: "Earthy Calm",
    description: "Grounding natural aromas",
    icon: Leaf,
    color: "from-[#E8ECD6] to-[#D3DAAE]",
    count: "8 candles",
  },
  {
    id: 3,
    name: "Evening Serenity",
    description: "Relaxing night scents",
    icon: Moon,
    color: "from-[#F2F4E8] to-[#DDE4BE]",
    count: "10 candles",
  },
  {
    id: 4,
    name: "Morning Refresh",
    description: "Energizing citrus notes",
    icon: Sun,
    color: "from-[#EDF1DB] to-[#C7CF9B]",
    count: "6 candles",
  },
];

export function Categories() {
  return (
    <section id="scents" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#E8ECD6] to-[#F2F4E8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#636B2F]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Scent Categories
          </h2>
          <p className="text-[#4A5422] mt-2">
            Explore curated fragrance families designed to evoke a unique mood.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: typeof categories[0] }) {
  const Icon = category.icon;
  const slug = category.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/products?category=${slug}`} className="group block">
      <div
        className={`relative rounded-3xl overflow-hidden border border-[#E4E0D6] bg-gradient-to-br ${category.color} p-4 shadow-sm transition-shadow group-hover:shadow-md`}
      >
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#636B2F] shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <h3
          className="text-[15px] font-semibold text-[#2F2A24]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-[#4A5422]">{category.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-[#636B2F]">
          <span>{category.count}</span>
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
