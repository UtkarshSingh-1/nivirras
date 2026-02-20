export const revalidate = 300

import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, Clock, Flame } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24">
      <div className="bg-gradient-to-br from-[#FAF8F5] via-[#F5EFE7] to-[#E8DFD4] px-4 py-16 text-center">
        <Flame className="mx-auto mb-4 h-10 w-10 text-[#C9A66B]" />
        <h1
          className="mb-4 text-5xl font-bold text-[#3D2B1F]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Get in Touch
        </h1>
        <p className="mx-auto max-w-xl text-lg text-[#6B5743]">
          Have a question about our candles? We typically respond within 24 hours.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#E8DFD4] bg-white p-8 shadow-sm">
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
            <div className="rounded-2xl border border-[#E8DFD4] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE7]">
                  <Phone className="h-5 w-5 text-[#C9A66B]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Call Us</h3>
              </div>
              <p className="text-sm text-[#6B5743]">Customer Support</p>
              <p className="mt-1 font-semibold text-[#3D2B1F]">+91 98765 43210</p>
              <p className="mt-1 text-xs text-[#8B7355]">Mon - Sat: 10 AM - 6 PM IST</p>
            </div>

            <div className="rounded-2xl border border-[#E8DFD4] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE7]">
                  <Mail className="h-5 w-5 text-[#C9A66B]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Email Us</h3>
              </div>
              <p className="text-sm text-[#6B5743]">General Inquiries</p>
              <p className="mt-1 font-semibold text-[#3D2B1F]">hello@nivirras.com</p>
              <p className="mt-1 text-xs text-[#8B7355]">We reply within 24 hours</p>
            </div>

            <div className="rounded-2xl border border-[#E8DFD4] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE7]">
                  <Clock className="h-5 w-5 text-[#C9A66B]" />
                </div>
                <h3 className="font-semibold text-[#3D2B1F]">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ["Monday - Friday", "10:00 AM - 6:00 PM"],
                  ["Saturday", "10:00 AM - 4:00 PM"],
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

            <div className="rounded-2xl border border-[#E8DFD4] bg-gradient-to-br from-[#F5EFE7] to-[#E8DFD4] p-6 text-center">
              <Flame className="mx-auto mb-2 h-8 w-8 text-[#C9A66B]" />
              <p className="text-sm leading-relaxed text-[#6B5743]">
                Every question matters to us. We hand-pour our candles with the same care we bring to every reply.
              </p>
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
                q: "What is your return policy?",
                a: "We offer a 7-day return policy for unopened candles. Reach out and we will make it right.",
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
              <Card key={q} className="border-[#E8DFD4] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold text-[#3D2B1F]">{q}</h3>
                  <p className="text-sm leading-relaxed text-[#6B5743]">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

