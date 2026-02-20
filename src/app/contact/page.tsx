import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock, Flame, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24">

      {/* Hero */}
      <div className="text-center py-16 px-4 bg-gradient-to-br from-[#FAF8F5] via-[#F5EFE7] to-[#E8DFD4]">
        <Flame className="h-10 w-10 text-[#C9A66B] mx-auto mb-4" />
        <h1
          className="text-5xl font-bold text-[#3D2B1F] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Get in Touch
        </h1>
        <p className="text-[#6B5743] text-lg max-w-xl mx-auto">
          Have a question about our candles? We'd love to hear from you — we typically respond within 24 hours.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* ── Contact Form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E8DFD4] p-8 shadow-sm">
              <h2
                className="text-2xl font-bold text-[#3D2B1F] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Send Us a Message
              </h2>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#3D2B1F] mb-1.5">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="Priya"
                      className="border-[#E8DFD4] focus-visible:ring-[#C9A66B]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#3D2B1F] mb-1.5">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Sharma"
                      className="border-[#E8DFD4] focus-visible:ring-[#C9A66B]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#3D2B1F] mb-1.5">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="priya@example.com"
                    className="border-[#E8DFD4] focus-visible:ring-[#C9A66B]"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#3D2B1F] mb-1.5">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Question about my order"
                    className="border-[#E8DFD4] focus-visible:ring-[#C9A66B]"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#3D2B1F] mb-1.5">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    className="min-h-[130px] border-[#E8DFD4] focus-visible:ring-[#C9A66B]"
                  />
                </div>

                <Button className="w-full bg-[#8B6F47] hover:bg-[#7A6040] text-white py-5 rounded-xl">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* ── Info Cards ── */}
          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl border border-[#E8DFD4] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#F5EFE7] rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#C9A66B]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Call Us</h3>
              </div>
              <p className="text-[#6B5743] text-sm">Customer Support</p>
              <p className="font-semibold text-[#3D2B1F] mt-1">+91 98765 43210</p>
              <p className="text-xs text-[#8B7355] mt-1">Mon – Sat: 10 AM – 6 PM IST</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DFD4] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#F5EFE7] rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-[#C9A66B]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Email Us</h3>
              </div>
              <p className="text-[#6B5743] text-sm">General Inquiries</p>
              <p className="font-semibold text-[#3D2B1F] mt-1">hello@nivirras.com</p>
              <p className="text-xs text-[#8B7355] mt-1">We reply within 24 hours</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DFD4] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#F5EFE7] rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#C9A66B]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ["Monday – Friday", "10:00 AM – 6:00 PM"],
                  ["Saturday", "10:00 AM – 4:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-[#6B5743]">
                    <span>{day}</span>
                    <span className={hours === "Closed" ? "text-red-400" : "font-medium text-[#3D2B1F]"}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warm CTA */}
            <div className="bg-gradient-to-br from-[#F5EFE7] to-[#E8DFD4] rounded-2xl border border-[#E8DFD4] p-6 text-center">
              <Flame className="h-8 w-8 text-[#C9A66B] mx-auto mb-2" />
              <p className="text-sm text-[#6B5743] leading-relaxed">
                Every question matters to us — we hand-pour our candles with the same care we bring to every reply. 🕯️
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2
            className="text-3xl font-bold text-center text-[#3D2B1F] mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                q: "How long does shipping take?",
                a: "We process orders within 1–2 business days. Standard delivery within India takes 3–5 business days.",
              },
              {
                q: "What is your return policy?",
                a: "We offer a 7-day return policy for unopened candles. Reach out and we'll make it right.",
              },
              {
                q: "Are your candles safe for pets?",
                a: "Our candles use natural soy/coconut wax with premium fragrance oils. We recommend keeping all candles away from pets and children.",
              },
              {
                q: "How do I track my order?",
                a: "Once your order ships, you'll receive a tracking number via email. You can also track it in your account dashboard.",
              },
            ].map(({ q, a }) => (
              <Card key={q} className="border-[#E8DFD4] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-[#3D2B1F] mb-2">{q}</h3>
                  <p className="text-sm text-[#6B5743] leading-relaxed">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}