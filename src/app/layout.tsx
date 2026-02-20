import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/candle-ui/Navbar";
import { Footer } from "@/components/candle-ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nivirras Collections | Premium Artisan Candles",
  description: "Handcrafted candles for your serenity.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-20">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
