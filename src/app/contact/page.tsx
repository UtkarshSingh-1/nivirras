export const revalidate = 300

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Phone, Clock, Flame, MapPin, Instagram, Youtube } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F2F4E8] pt-24">
      <div className="bg-gradient-to-br from-[#F2F4E8] via-[#E8ECD6] to-[#D3DAAE] px-4 py-16 text-center">
        <Flame className="mx-auto mb-4 h-10 w-10 text-[#8A9353]" />
        <h1
          className="mb-4 text-5xl font-bold text-[#3D2B1F]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Get in Touch
        </h1>
        <p className="mx-auto max-w-xl text-lg text-[#4A5422]">
          Have a question about our candles? We typically respond within 24 hours.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#D3DAAE] bg-white p-8 shadow-sm">
              <h2
                className="mb-6 text-2xl font-bold text-[#3D2B1F]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Send Us a Message
              </h2>
              <ContactForm />
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-[#D3DAAE] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8ECD6]">
                  <Phone className="h-5 w-5 text-[#8A9353]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Call Us</h3>
              </div>
              <p className="text-sm text-[#4A5422]">Customer Support</p>
              <p className="mt-1 font-semibold text-[#3D2B1F]">8787020097</p>
              <p className="mt-1 text-xs text-[#8B7355]">Mon - Sat: 10 AM - 6 PM IST</p>
            </div>

            <div className="rounded-2xl border border-[#D3DAAE] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8ECD6]">
                  <MapPin className="h-5 w-5 text-[#8A9353]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Visit Us</h3>
              </div>
              <p className="text-sm text-[#4A5422]">Store Address</p>
              <p className="mt-1 font-semibold text-[#3D2B1F]">
                Beside AK Music Academy near BDA Durga Mandir, Khadra, Lucknow 226020
              </p>
            </div>

            <div className="rounded-2xl border border-[#D3DAAE] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8ECD6]">
                  <Clock className="h-5 w-5 text-[#8A9353]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ["Monday - Friday", "10:00 AM - 6:00 PM"],
                  ["Saturday", "10:00 AM - 4:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-[#4A5422]">
                    <span>{day}</span>
                    <span className={hours === "Closed" ? "text-[#6A733B]" : "font-medium text-[#3D2B1F]"}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#D3DAAE] bg-gradient-to-br from-[#E8ECD6] to-[#D3DAAE] p-6 text-center">
              <Flame className="mx-auto mb-2 h-8 w-8 text-[#8A9353]" />
              <p className="mb-4 text-sm leading-relaxed text-[#4A5422]">Follow us</p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="https://www.instagram.com/nivirras_collection?igsh=ODJia3ljMDB3b3Z0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#4A5422] transition hover:bg-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://youtube.com/@nivirras_collection?si=akEFlY4hj6eP4RuE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#4A5422] transition hover:bg-white"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2
            className="mb-10 text-center text-3xl font-bold text-[#3D2B1F]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                q: "How long does shipping take?",
                a: "We process orders within 1-2 business days. Standard delivery within India takes 3-5 business days.",
              },
              {
                q: "How quickly do you dispatch orders?",
                a: "Most orders are dispatched within 1-2 business days, and tracking details are shared by email.",
              },
              {
                q: "Are your candles safe for pets?",
                a: "Our candles use natural soy/coconut wax with premium fragrance oils. Keep all candles away from pets and children.",
              },
              {
                q: "How do I track my order?",
                a: "Once your order ships, you will receive a tracking number via email. You can also track it in your account dashboard.",
              },
            ].map(({ q, a }) => (
              <Card key={q} className="border-[#D3DAAE] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold text-[#3D2B1F]">{q}</h3>
                  <p className="text-sm leading-relaxed text-[#4A5422]">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


