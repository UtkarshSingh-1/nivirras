"use client";

import { motion } from "motion/react";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=bestselling" },
    { label: "Gift Sets", href: "/products?category=gift-sets" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Sustainability", href: "/about#sustainability" },
    { label: "Quality Promise", href: "/about#quality" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-b from-[#4A3F35] to-[#3A3127] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h3
                className="text-3xl mb-4 text-[#F5EFE7]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                NIVIRRAS Collections
              </h3>
              <p
                className="text-[#E8DFD4] leading-relaxed mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Crafting moments of serenity through premium artisan candles. Each piece is a testament to quality, beauty, and mindful living.
              </p>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-3 text-[#E8DFD4]">
                <MapPin className="w-5 h-5 text-[#C9A66B]" />
                <span className="text-sm">123 Serenity Lane, Peaceful Valley, CA 94016</span>
              </div>
              <div className="flex items-center gap-3 text-[#E8DFD4]">
                <Phone className="w-5 h-5 text-[#C9A66B]" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-[#E8DFD4]">
                <Mail className="w-5 h-5 text-[#C9A66B]" />
                <span className="text-sm">hello@nivirras.com</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <FooterSection title="Shop" links={footerLinks.shop} />
          <FooterSection title="About" links={footerLinks.about} />
          <FooterSection title="Support" links={footerLinks.support} />
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-8 pt-8 border-t border-[#6B5743]"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#6B5743] hover:bg-gradient-to-br hover:from-[#8B6F47] hover:to-[#C9A66B] rounded-full flex items-center justify-center transition-all shadow-lg"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright */}
        <div
          className="text-center text-sm text-[#E8DFD4]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <p>© 2026 Nivirras Collections. All rights reserved.</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-[#C9A66B] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#6B5743]">•</span>
            <Link href="/terms" className="hover:text-[#C9A66B] transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#6B5743]">•</span>
            <Link href="/accessibility" className="hover:text-[#C9A66B] transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h4
        className="text-xl mb-4 text-[#F5EFE7]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}
      </h4>
      <ul className="space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[#E8DFD4] hover:text-[#C9A66B] transition-colors text-sm inline-block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
