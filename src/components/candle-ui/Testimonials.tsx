import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Khushi",
    text: "Absolutely loved the candles from Nivirass Collections! The fragrance is long-lasting, soothing, and instantly makes my room feel cozy and elegant. The packaging was beautiful too perfect for gifting!",
    rating: 5,
  },
  {
    id: 2,
    name: "Naman",
    text: "I recently bought scented candles from Nivirass Collections and I'm genuinely impressed with the quality. The aroma is refreshing without being overpowering, and the candles burn evenly for hours.",
    rating: 5,
  },
  {
    id: 3,
    name: "Varsha",
    text: "The candles from Nivirass Collections exceeded my expectations. They add such a warm and aesthetic vibe to my space. Great fragrance, premium feel, and definitely worth purchasing again.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#E8ECD6] to-[#D3DAAE] relative overflow-hidden">
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#8A9353] rounded-full blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-4 text-[#313919]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            What Our Customers Say
          </h2>
          <p className="text-lg text-[#4A5422] max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Join thousands of satisfied customers who have elevated their spaces with Nivirras Collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="group">
      <div className="relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md p-8 shadow-lg border border-white/50 h-full hover:shadow-2xl transition-all duration-300">
        <div className="absolute top-6 right-6 opacity-10">
          <Quote className="w-16 h-16 text-[#636B2F]" />
        </div>

        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <div key={i}>
              <Star className="w-5 h-5 fill-[#8A9353] text-[#8A9353]" />
            </div>
          ))}
        </div>

        <p className="text-[#4A5422] mb-6 leading-relaxed relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
          "{testimonial.text}"
        </p>

        <h4 className="text-lg text-[#313919] relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {testimonial.name}
        </h4>

        <div className="absolute inset-0 bg-gradient-radial from-[#8A9353] to-transparent blur-2xl pointer-events-none opacity-10" />
      </div>
    </div>
  );
}
