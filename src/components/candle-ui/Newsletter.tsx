"use client";

import { motion } from "motion/react";
import { Mail, Send } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#D3DAAE] to-[#F2F4E8] relative overflow-hidden">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#8A9353]/20 to-transparent blur-3xl"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#636B2F] to-[#8A9353] rounded-full mb-6 shadow-xl"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>

          <h2
            className="text-5xl md:text-6xl mb-4 text-[#313919]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Join Our Community
          </h2>
          <p
            className="text-lg text-[#4A5422] mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Subscribe to receive exclusive offers, early access to new collections, and inspiration for creating your perfect sanctuary
          </p>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 bg-white/70 backdrop-blur-md rounded-3xl sm:rounded-full shadow-lg border border-white/50 p-3 sm:p-2 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 w-full min-w-0">
                  <Mail className="w-5 h-5 text-[#636B2F] ml-2 sm:ml-4 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full min-w-0 bg-transparent border-none outline-none px-2 py-3 text-[#313919] placeholder:text-[#636B2F]/50"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    required
                    suppressHydrationWarning
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto justify-center px-6 py-3 bg-gradient-to-r from-[#636B2F] to-[#8A9353] text-white rounded-full flex items-center gap-2 shadow-md"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-[#636B2F]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ✓ Thank you for subscribing! Check your inbox soon.
              </motion.div>
            )}
          </motion.form>

          <p
            className="text-sm text-[#636B2F] mt-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}


