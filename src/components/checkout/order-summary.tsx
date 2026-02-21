"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

interface CartItem {
  id: string
  quantity: number
  size?: string
  color?: string
  product: {
    name: string
    price: number
    images: string[]
  }
}

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  promoCode?: string | null
  total: number
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  discount,
  promoCode,
  total,
}: OrderSummaryProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
        <CardDescription>
          Review your items before checkout
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded">
              <Image
                src={getSafeImageSrc(item.product.images)}
                alt={item.product.name}
                width={48}
                height={48}
                className="object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-medium text-sm">
                  {item.product.name}
                </p>

                <div className="flex gap-2 mt-1">
                  {item.size && <Badge variant="outline">{item.size}</Badge>}
                  {item.color && <Badge variant="outline">{item.color}</Badge>}
                </div>

                <div className="flex justify-between mt-2 text-sm">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>
                Discount {promoCode ? `(${promoCode})` : ""}
              </span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-lg text-[#3D2B1F]">
            <span>Total</span>
            <span className="text-[#636B2F]">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getSafeImageSrc(images?: string[]) {
  const fallback = "/placeholder-product.jpg"

  if (!Array.isArray(images) || images.length === 0) return fallback
  const candidate = (images[0] || "").trim()
  if (!candidate) return fallback

  if (candidate.startsWith("/")) return candidate

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return candidate
    }
  } catch {
    return fallback
  }

  return fallback
}

