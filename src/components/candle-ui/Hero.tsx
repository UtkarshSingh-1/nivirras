import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex items-start justify-center overflow-hidden bg-gradient-to-br from-[#F2F4E8] via-[#E6EBCF] to-[#D3DAAE]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#8A9353]/25 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#636B2F]/25 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-8 pb-8">
        <div className="grid items-center gap-12 md:grid-cols-1">
          <div className="text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D3DAAE] bg-white/55 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#636B2F]" />
              <span className="text-sm text-[#4A5422]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Premium Artisan Candles
              </span>
            </div>

            <h1
              className="mb-6 text-5xl leading-tight text-[#313919] md:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Nivirras
              <br />
              Collections
            </h1>

            <p className="mb-8 max-w-md text-xl text-[#4A5422]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Hand poured candles crafted to elevate your space
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                prefetch
                className="inline-flex rounded-full bg-[#636B2F] px-8 py-4 text-white shadow-lg transition-all hover:bg-[#4A5422]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Shop Collection
              </Link>
              <Link
                href="/products?trending=true"
                prefetch
                className="inline-flex rounded-full border border-[#D3DAAE] bg-white px-8 py-4 text-[#313919] transition-all hover:border-[#636B2F] hover:bg-[#EDF1DB]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore Scents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
