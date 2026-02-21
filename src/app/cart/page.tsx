"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { CartItem } from "@/components/cart/cart-item"
import { EmptyCart } from "@/components/cart/empty-cart"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { cartItems, updateQuantity, removeItem, loading } = useCart()

  const handleCheckout = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed with checkout",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )
  const shipping = 0
  const total = subtotal + shipping

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F2F4E8] pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <CartSkeleton />
        </div>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F2F4E8] pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <EmptyCart />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F2F4E8] pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-[#D3DAAE] bg-white/70">
              <CardHeader>
                <CardTitle className="text-[#3D2B1F]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator className="bg-[#D3DAAE]" />

                <div className="flex justify-between text-[#4A5422]">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-[#4A5422]">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-700 font-semibold">Free</span>
                    ) : (
                      <span className="font-medium">{formatPrice(shipping)}</span>
                    )}
                  </span>
                </div>

                <Separator className="bg-[#D3DAAE]" />

                <div className="flex justify-between font-semibold text-lg text-[#3D2B1F]">
                  <span>Total</span>
                  <span className="text-[#636B2F]">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button
                  className="w-full bg-[#636B2F] hover:bg-[#4A5422] hover:shadow-lg transition-all"
                  onClick={handleCheckout}
                >
                  {session ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

function CartSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="w-20 h-20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

