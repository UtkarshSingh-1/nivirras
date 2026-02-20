import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Award, Users, Flame } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-[#8B6F47] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Our Story
          </p>
          <h1
            className="text-5xl font-bold text-[#3D2B1F] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            About Nivirras Collections
          </h1>
          <p className="text-lg text-[#6B5743] max-w-3xl mx-auto leading-relaxed">
            Nivirras Collections was born from a love of warmth, scent, and the quiet magic a candle brings to any space.
            We hand-pour every candle with care, using natural waxes and premium fragrance oils to create an experience
            that lingers long after the flame goes out.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-[#E8DFD4] bg-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Flame className="h-5 w-5 text-[#C9A66B]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B5743] leading-relaxed">
                To craft candles that transform everyday moments into rituals. We believe light and scent have the
                power to calm, inspire, and restore — and we pour that belief into every batch we make.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#E8DFD4] bg-white/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Award className="h-5 w-5 text-[#C9A66B]" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B5743] leading-relaxed">
                To become India's most beloved artisan candle brand — one that people trust for quality, cherish as a gift,
                and return to for the comfort only a familiar scent can give.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2
            className="text-3xl font-bold text-center text-[#3D2B1F] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-[#E8DFD4] bg-white/70 text-center">
              <CardHeader>
                <Heart className="h-8 w-8 text-[#C9A66B] mx-auto mb-2" />
                <CardTitle className="text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Handcrafted with Love
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B5743] text-sm leading-relaxed">
                  Every candle is hand-poured in small batches, ensuring each one gets the attention it deserves.
                  No shortcuts, no mass production.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E8DFD4] bg-white/70 text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-[#C9A66B] mx-auto mb-2" />
                <CardTitle className="text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Community First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B5743] text-sm leading-relaxed">
                  Our customers inspire our scents. We listen to feedback, incorporate ideas, and grow together
                  with the people who light our candles every day.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E8DFD4] bg-white/70 text-center">
              <CardHeader>
                <Award className="h-8 w-8 text-[#C9A66B] mx-auto mb-2" />
                <CardTitle className="text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Clean & Sustainable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B5743] text-sm leading-relaxed">
                  We use natural soy and coconut wax, lead-free cotton wicks, and responsibly sourced fragrance oils.
                  Good for you, gentle on the planet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "5K+", label: "Happy Customers" },
            { value: "30+", label: "Unique Scents" },
            { value: "100%", label: "Natural Wax" },
            { value: "4.9★", label: "Customer Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-white/70 border border-[#E8DFD4] rounded-xl py-6 px-4">
              <div
                className="text-3xl font-bold text-[#C9A66B] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-[#6B5743]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div className="text-center bg-gradient-to-br from-[#F5EFE7] to-[#E8DFD4] rounded-2xl p-12 border border-[#E8DFD4]">
          <Flame className="h-10 w-10 text-[#C9A66B] mx-auto mb-4" />
          <h2
            className="text-3xl font-bold text-[#3D2B1F] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Light a Candle. Feel the Difference.
          </h2>
          <p className="text-[#6B5743] max-w-xl mx-auto leading-relaxed">
            Whether it's a quiet evening ritual or a thoughtful gift for someone special — Nivirras candles are made
            to make every moment more meaningful.
          </p>
        </div>

      </div>
    </div>
  )
}
