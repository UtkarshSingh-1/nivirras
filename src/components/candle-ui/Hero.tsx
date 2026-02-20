"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#F5EFE7] to-[#E8DFD4] -mt-20">
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
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A66B]/20 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B6F47]/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full mb-6 border border-[#E8DFD4]"
            >
              <Sparkles className="w-4 h-4 text-[#C9A66B]" />
              <span className="text-sm text-[#6B5743]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Premium Artisan Candles
              </span>
            </motion.div>

            <h1
              className="text-6xl md:text-7xl mb-6 text-[#4A3F35] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Nivirras
              <br />
              Collections
            </h1>

            <p
              className="text-xl text-[#6B5743] mb-8 max-w-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Handcrafted candles for serene living
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" prefetch>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 111, 71, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-[#8B6F47] to-[#C9A66B] text-white rounded-full shadow-lg transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Shop Collection
                </motion.button>
              </Link>
              <Link href="/products?trending=true" prefetch>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/70 backdrop-blur-sm text-[#6B5743] rounded-full border border-[#E8DFD4] hover:border-[#C9A66B] transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Explore Scents
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* 3D Candle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative pt-16"
          >
            <CandleDisplay />
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
        <div className="w-6 h-10 border-2 border-[#C9A66B] rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#C9A66B] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

function CandleDisplay() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow Effect */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-radial from-[#FFD700]/30 via-[#FFA500]/20 to-transparent rounded-full blur-3xl"
      />

      {/* Candle Image with 3D Effect */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/30 border border-white/50 p-8">
          <Image
            src="https://images.unsplash.com/photo-1641837225643-f999493f6375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYW5kbGUlMjBnbGFzcyUyMGphciUyMHdhcm0lMjBnbG93fGVufDF8fHx8MTc3MTUwODI5OXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury Candle"
            width={1080}
            height={1350}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto object-cover rounded-2xl"
          />

          {/* Flame Flicker Effect */}
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-radial from-[#FFD700] via-[#FFA500] to-transparent rounded-full blur-2xl opacity-70"
          />
        </div>

        {/* Reflection Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF8F5] to-transparent blur-sm" />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
            x: Math.random() * 50 - 25,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          className="absolute bottom-20 left-1/2 w-1 h-1 bg-[#FFD700] rounded-full"
        />
      ))}
    </div>
  );
}
