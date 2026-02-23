import { Sparkles, Heart, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const features = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Handcrafted with the finest natural waxes and premium fragrance oils",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each candle is poured with intention and care in small batches",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Sustainable practices and natural ingredients for conscious living",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 px-6 bg-gradient-to-b from-[#F2F4E8] to-[#E8ECD6] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8A9353]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#636B2F]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1658511629019-39e55d37515a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2FuZGxlJTIwcGFja2FnaW5nJTIwZ29sZHxlbnwxfHx8fDE3NzE1MDgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Nivirras Collections Candles"
                width={1080}
                height={1350}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-[500px] object-cover"
              />
              {/* Glassmorphism Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#313919]/30 to-transparent" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[#D3DAAE]">
              <div className="text-center">
                <div
                  className="text-4xl text-[#636B2F] mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  5000+
                </div>
                <div
                  className="text-sm text-[#4A5422]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Happy Customers
                </div>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div>
            <h2
              className="text-5xl md:text-6xl mb-6 text-[#313919]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Crafted for Serene Living
            </h2>
            <p
              className="text-lg text-[#4A5422] mb-8 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              At Nivirras Collections, we believe in the transformative power of scent. Each candle is thoughtfully crafted using premium natural ingredients, combining timeless elegance with modern artistry. Our mission is to bring warmth, calm, and beauty into your everyday moments.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#636B2F] to-[#8A9353] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4
                      className="text-xl text-[#313919] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className="text-[#4A5422]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about">
              <button
                className="px-8 py-4 bg-[#636B2F] hover:bg-[#4A5422] text-white rounded-full shadow-lg transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Learn More About Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


