"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-gradient-to-br from-[#F2F4E8] via-[#E6EBCF] to-[#D3DAAE] -mt-20">
      {/* Ambient Glow Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8A9353]/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#636B2F]/25 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24 w-full">
        <div className="grid md:grid-cols-1 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/55 backdrop-blur-sm rounded-full mb-6 border border-[#D3DAAE]"
            >
              <Sparkles className="w-4 h-4 text-[#636B2F]" />
              <span className="text-sm text-[#4A5422]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Premium Artisan Candles
              </span>
            </motion.div>

            <h1
              className="text-6xl md:text-7xl mb-6 text-[#313919] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Nivirras
              <br />
              Collections
            </h1>

            <p
              className="text-xl text-[#4A5422] mb-8 max-w-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Hand poured candles crafted to elevate your space
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(74, 84, 34, 0.28)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/products"
                  prefetch
                  className="inline-flex px-8 py-4 bg-[#636B2F] hover:bg-[#4A5422] text-white rounded-full shadow-lg transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Shop Collection
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/products?trending=true"
                  prefetch
                  className="inline-flex px-8 py-4 bg-white text-[#313919] rounded-full border border-[#D3DAAE] hover:border-[#636B2F] hover:bg-[#EDF1DB] transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Explore Scents
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#636B2F] rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#636B2F] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
