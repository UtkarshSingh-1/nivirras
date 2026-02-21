import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"

import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { AddProductSection } from "@/components/admin/add-product-section"

import { Tag, ShoppingBag, Users, PackageOpen, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  let totalOrders = 0
  let totalProducts = 0
  let totalUsers = 0
  let totalRevenue = 0
  let activePromos = 0
  let dbUnavailable = false

  try {
    const [ordersCount, productsCount, usersCount, revenue, promosCount] =
      await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count(),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { paymentStatus: "PAID" },
        }),
        prisma.promoCode.count({ where: { isActive: true } }),
      ])

    totalOrders = ordersCount
    totalProducts = productsCount
    totalUsers = usersCount
    totalRevenue = Number(revenue._sum.total) || 0
    activePromos = promosCount
  } catch (error) {
    dbUnavailable = true
    console.error("Admin dashboard DB unavailable:", error)
  }

  return (
    <div className="min-h-screen bg-[#F2F4E8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-[#313919]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-[#4A5422] mt-1">
            Welcome back - here&apos;s what&apos;s happening with Nivirras Collections.
          </p>
          {dbUnavailable && (
            <p className="mt-3 rounded-md border border-[#D3DAAE] bg-[#EDF1DB] px-3 py-2 text-sm text-[#4A5422]">
              Database is temporarily unreachable. Showing fallback values.
            </p>
          )}
        </div>

        <DashboardStats
          totalOrders={totalOrders}
          totalProducts={totalProducts}
          totalUsers={totalUsers}
          totalRevenue={totalRevenue}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
            { label: "Products", icon: PackageOpen, href: "/admin/products" },
            { label: "Customers", icon: Users, href: "/admin/users" },
            { label: "Promo Codes", icon: TrendingUp, href: "/admin/promocodes" },
          ].map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-[#D3DAAE] bg-[#EDF1DB] text-[#4A5422] hover:opacity-90 transition-opacity"
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <RecentOrders />
          <AddProductSection />
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-5 mt-8">
          <ManagementCard
            title="Promo Codes"
            description="Active discount coupons"
            count={activePromos}
            icon={<Tag className="h-5 w-5" />}
            href="/admin/promocodes"
            cta="Manage"
          />
        </div>
      </div>
    </div>
  )
}

function ManagementCard({
  title,
  description,
  count,
  icon,
  href,
  cta,
}: {
  title: string
  description: string
  count: number
  icon: React.ReactNode
  href: string
  cta: string
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#D3DAAE] bg-white shadow-sm">
      <div className="bg-gradient-to-r from-[#636B2F] to-[#8A9353] p-4 flex items-center gap-3">
        <div className="bg-white/20 rounded-lg p-2 text-white">{icon}</div>
        <div>
          <p className="text-white font-semibold text-sm">{title}</p>
          <p className="text-white/75 text-xs">{description}</p>
        </div>
      </div>
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="text-4xl font-bold text-[#313919]">{count}</span>
        <Link
          href={href}
          className="text-xs font-semibold text-[#636B2F] hover:text-[#4A5422] border border-[#D3DAAE] rounded-lg px-3 py-1.5 hover:border-[#8A9353] transition-colors"
        >
          {cta} &rarr;
        </Link>
      </div>
    </div>
  )
}
