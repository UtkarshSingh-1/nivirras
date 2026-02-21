"use client";

import { ShoppingBag, Menu, Search, User, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { useCart } from "@/contexts/cart-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Warm up likely next routes for snappier navigations.
    router.prefetch("/products");
    router.prefetch("/cart");
    router.prefetch("/contact");
    if (session?.user) {
      router.prefetch("/profile");
      router.prefetch("/orders");
      if (session.user.role === "ADMIN") {
        router.prefetch("/admin");
      }
    }
  }, [router, session?.user, session?.user?.role]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4E8]/90 backdrop-blur-md shadow-sm transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" prefetch>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl tracking-wider cursor-pointer"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <span className="text-[#4A5422]">NIVIRRAS</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Shop</NavLink>
            <NavLink href="/products?category=candles">Candles</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white rounded-full border border-[#D3DAAE] overflow-hidden"
                >
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="border-none shadow-none h-8 px-3 text-sm focus-visible:ring-0 bg-transparent"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="pr-2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-[#636B2F]/10 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-[#4A5422]" />
                </motion.button>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" prefetch>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-[#636B2F]/10 rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5 text-[#4A5422]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#636B2F] text-white text-xs flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* User Menu */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-[#636B2F]/10 rounded-full transition-colors"
                  >
                    <User className="w-5 h-5 text-[#4A5422]" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border-[#D3DAAE]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" prefetch>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" prefetch>Orders</Link>
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" prefetch>Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-700">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn()} variant="ghost" size="sm" className="hidden md:flex text-[#4A5422] hover:text-[#636B2F] hover:bg-[#636B2F]/10">
                Login
              </Button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="w-6 h-6 text-[#4A5422]" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 py-4 border-t border-[#D3DAAE] overflow-hidden bg-[#F2F4E8]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex flex-col gap-4">
                <NavLink href="/" mobile onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                <NavLink href="/products" mobile onClick={() => setIsMobileMenuOpen(false)}>Shop</NavLink>
                <NavLink href="/products?category=candles" mobile onClick={() => setIsMobileMenuOpen(false)}>Candles</NavLink>
                <NavLink href="/about" mobile onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
                <NavLink href="/contact" mobile onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
                {!session?.user && (
                  <div className="px-3 py-2">
                    <Button onClick={() => signIn()} className="w-full bg-[#636B2F] hover:bg-[#4A5422] text-white">Login</Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children, mobile, onClick }: { href: string; children: React.ReactNode; mobile?: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      className={`block text-[#4A5422] hover:text-[#636B2F] transition-colors ${mobile ? "text-base px-3 py-2 hover:bg-[#636B2F]/5 rounded-md" : "text-sm"
        }`}
    >
      {children}
    </Link>
  );
}
