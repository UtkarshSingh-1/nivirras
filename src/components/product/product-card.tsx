'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number | null
    images: string[]
    featured: boolean
    trending: boolean
    averageRating?: number
    reviewCount?: number
    category: {
      name: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession()
  const { addToCart: addToCartContext } = useCart()
  const discountPercentage = product.comparePrice
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0

  const [isPending] = useTransition()
  const [adding, setAdding] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const images = Array.isArray(product.images)
    ? product.images.filter(img => typeof img === 'string' && img.trim() !== '')
    : []

  const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg']
  const hasMultipleImages = displayImages.length > 1
  const averageRating = Number(product.averageRating || 0)
  const reviewCount = Number(product.reviewCount || 0)

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < rating ? "fill-[#B67857] text-[#B67857]" : "text-[#E1D2C4]"
        )}
      />
    ))

  const addToCart = async () => {
    setAdding(true)
    try {
      await addToCartContext(product.id, 1)
      toast({ title: 'Added to Cart', description: `${product.name} added to your cart.` })
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to add to cart', variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  const addToWishlist = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    setAddingToWishlist(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to Wishlist",
          description: "Product has been added to your wishlist",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400 && errorData.error === 'Item already in wishlist') {
          toast({
            title: "Already in Wishlist",
            description: "This product is already in your wishlist",
            variant: "destructive",
          });
        } else {
          throw new Error("Failed to add to wishlist");
        }
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to add product to wishlist",
        variant: "destructive",
      });
    } finally {
      setAddingToWishlist(false);
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <Card className="group gap-0 overflow-hidden rounded-2xl border border-[#E4E0D6] bg-white shadow-none transition-shadow md:hover:shadow-lg">
      <div
        className="relative aspect-square overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.slug}`}>
          <Image
            src={displayImages[currentImageIndex]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 md:object-contain md:group-hover:scale-105"
          />
        </Link>

        {/* Image Navigation Buttons */}
        {hasMultipleImages && isHovered && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 opacity-0 transition-opacity bg-background/80 hover:bg-background h-8 w-8 p-0 md:inline-flex md:group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 opacity-0 transition-opacity bg-background/80 hover:bg-background h-8 w-8 p-0 md:inline-flex md:group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 gap-1 md:flex">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex(index)
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  currentImageIndex === index
                    ? "bg-white w-4"
                    : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        <div className="absolute top-2 left-2 hidden flex-col gap-1 md:flex">
          {product.featured && (
            <Badge className="bg-[#636B2F]">Featured</Badge>
          )}
          {product.trending && (
            <Badge variant="secondary">Trending</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-[#636B2F]">{discountPercentage}% OFF</Badge>
          )}
        </div>
        {discountPercentage > 0 && (
          <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#7A5A45] shadow-sm md:hidden">
            Sale
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            addToWishlist()
          }}
          disabled={addingToWishlist}
          className="absolute top-2 right-2 hidden opacity-0 transition-opacity bg-background/80 hover:bg-background md:inline-flex md:group-hover:opacity-100"
        >
          <Heart className={cn("h-4 w-4", addingToWishlist && "animate-pulse")} />
        </Button>
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="mb-1 hidden text-xs text-muted-foreground sm:block">
          {product.category.name}
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-[13px] font-medium text-[#2F2A24] transition-colors hover:text-[#636B2F] sm:text-sm">
            {product.name}
          </h3>
        </Link>
        {reviewCount > 0 && (
          <div className="mb-1 flex items-center gap-2 text-xs text-[#8A6A55]">
            <div className="flex items-center gap-0.5">{renderStars(Math.round(averageRating))}</div>
            <span>({reviewCount})</span>
          </div>
        )}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-[15px] font-semibold text-[#2F2A24]">{formatPrice(Number(product.price))}</span>
          {product.comparePrice && (
            <span className="text-xs text-muted-foreground line-through sm:text-sm">
              {formatPrice(Number(product.comparePrice))}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="hidden p-4 pt-0 md:flex">
        <Button className="w-full bg-[#636B2F] hover:bg-[#4A5422]" onClick={addToCart} disabled={adding || isPending || addingToWishlist}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {adding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
