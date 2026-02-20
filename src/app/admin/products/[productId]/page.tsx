import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { jsonToStringArray } from "@/lib/utils"
import { AdminProductHeader } from "@/components/admin/products/admin-product-header"
import { AdminProductDetails } from "@/components/admin/products/admin-product-details"
import { AdminProductActions } from "@/components/admin/products/admin-product-actions"
import { AdminProductAnalytics } from "@/components/admin/products/admin-product-analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const { productId } = await params

  let product;
  try {
    product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        orderItems: {
          include: {
            order: {
              select: {
                id: true,
                status: true,
                createdAt: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        wishlistItems: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error('Database error:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Database Connection Error</h1>
          <p className="text-muted-foreground">
            Unable to connect to the database. Please check your connection and try again.
          </p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const serializedProduct: any = {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    images: jsonToStringArray(product.images),
    sizes: jsonToStringArray(product.sizes) as string[],
    colors: jsonToStringArray(product.colors) as string[],
    createdAt: product.createdAt.toISOString(),
    category: {
      ...product.category,
      createdAt: product.category.createdAt.toISOString(),
      updatedAt: product.category.updatedAt.toISOString(),
    },
    orderItems: product.orderItems.map((item: any) => ({
      ...item,
      price: Number(item.price),
      createdAt: item.createdAt.toISOString(),
      order: {
        ...item.order,
        createdAt: item.order.createdAt.toISOString(),
      },
    })),
    wishlistItems: product.wishlistItems.map((w: any) => ({
      ...w,
      createdAt: w.createdAt.toISOString(),
    })),
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminProductHeader product={serializedProduct as any} />

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-background border-0 shadow-md">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <AdminProductDetails product={serializedProduct as any} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <AdminProductAnalytics product={serializedProduct as any} />
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <AdminProductOrders product={serializedProduct as any} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <AdminProductActions product={serializedProduct as any} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminProductOrders({ product }: { product: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-600'
      case 'CONFIRMED': return 'bg-blue-600'
      case 'PROCESSING': return 'bg-indigo-600'
      case 'SHIPPED': return 'bg-purple-600'
      case 'DELIVERED': return 'bg-green-600'
      case 'CANCELLED': return 'bg-red-600'
      case 'COMPLETED': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {product.orderItems.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No orders found for this product
            </p>
          ) : (
            product.orderItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30">
                <div>
                  <div className="font-medium">
                    Order #{item.order.id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.order.user.name || item.order.user.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(new Date(item.order.createdAt))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Qty: {item.quantity}</div>
                  <Badge className={`text-xs border-0 ${getStatusColor(item.order.status)}`}>
                    {item.order.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
