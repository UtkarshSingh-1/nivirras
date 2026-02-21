"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Home Designer",
    text: "These candles have completely transformed the ambiance of my home. The quality is exceptional, and the scents are perfectly balanced—not overpowering, just elegantly present.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Wellness Coach",
    text: "I've tried many luxury candle brands, but Nivirras Collections stands out. The burn time is incredible, and the natural ingredients make all the difference. Absolutely worth every penny.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Interior Stylist",
    text: "From the packaging to the first light, everything about these candles screams luxury. They've become an essential part of my evening routine. Pure bliss!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#E8ECD6] to-[#D3DAAE] relative overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute top-20 right-20 w-64 h-64 bg-[#8A9353] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-5xl md:text-6xl mb-4 text-[#313919]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            What Our Customers Say
          </h2>
          <p
            className="text-lg text-[#4A5422] max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Join thousands of satisfied customers who have elevated their spaces with Nivirras Collections
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md p-8 shadow-lg border border-white/50 h-full hover:shadow-2xl transition-all duration-300">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10">
          <Quote className="w-16 h-16 text-[#636B2F]" />
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
            >
              <Star className="w-5 h-5 fill-[#8A9353] text-[#8A9353]" />
            </motion.div>
          ))}
        </div>

        {/* Testimonial Text */}
        <p
          className="text-[#4A5422] mb-6 leading-relaxed relative z-10"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          "{testimonial.text}"
        </p>

        {/* Customer Info */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#8A9353] shadow-md">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={48}
              height={48}
              sizes="48px"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4
              className="text-lg text-[#313919]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {testimonial.name}
            </h4>
            <p
              className="text-sm text-[#636B2F]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Hover Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.15 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-radial from-[#8A9353] to-transparent blur-2xl pointer-events-none"
        />
      </div>
    </motion.div>
  );
}


