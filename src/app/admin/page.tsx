import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"

import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { AddProductSection } from "@/components/admin/add-product-section"

import {
  Tag,
  RefreshCcw,
  Repeat,
  XCircle,
  ShoppingBag,
  Users,
  PackageOpen,
  TrendingUp,
} from "lucide-react"

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
  let pendingReturns = 0
  let pendingExchanges = 0
  let cancelledOrders = 0
  let dbUnavailable = false

  try {
    const [
      ordersCount,
      productsCount,
      usersCount,
      revenue,
      promosCount,
      returnsCount,
      exchangesCount,
      cancelledCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.promoCode.count({ where: { isActive: true } }),
      prisma.returnRequest.count({ where: { status: "REQUESTED" } }),
      prisma.exchangeRequest.count({ where: { status: "REQUESTED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
    ])

    totalOrders = ordersCount
    totalProducts = productsCount
    totalUsers = usersCount
    totalRevenue = Number(revenue._sum.total) || 0
    activePromos = promosCount
    pendingReturns = returnsCount
    pendingExchanges = exchangesCount
    cancelledOrders = cancelledCount
  } catch (error) {
    dbUnavailable = true
    console.error("Admin dashboard DB unavailable:", error)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-[#3D2B1F]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-[#6B5743] mt-1">Welcome back - here's what's happening with Nivirras Collections.</p>
          {dbUnavailable && (
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Database is temporarily unreachable. Showing fallback values.
            </p>
          )}
        </div>

        {/* Stats */}
        <DashboardStats
          totalOrders={totalOrders}
          totalProducts={totalProducts}
          totalUsers={totalUsers}
          totalRevenue={totalRevenue}
        />

        {/* Quick Nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Orders", icon: ShoppingBag, href: "/admin/orders", color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Products", icon: PackageOpen, href: "/admin/products", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { label: "Customers", icon: Users, href: "/admin/users", color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Promo Codes", icon: TrendingUp, href: "/admin/promocodes", color: "bg-purple-50 text-purple-700 border-purple-200" },
          ].map(({ label, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 p-4 rounded-xl border ${color} hover:opacity-80 transition-opacity`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders + Add Product */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <RecentOrders />
          <AddProductSection />
        </div>

        {/* Management Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          <ManagementCard
            title="Promo Codes"
            description="Active discount coupons"
            count={activePromos}
            icon={<Tag className="h-5 w-5" />}
            href="/admin/promocodes"
            cta="Manage"
            color="from-amber-500 to-orange-400"
          />
          <ManagementCard
            title="Returns"
            description="Pending return requests"
            count={pendingReturns}
            icon={<RefreshCcw className="h-5 w-5" />}
            href="/admin/returns"
            cta="Review"
            color="from-rose-500 to-pink-400"
            highlight={pendingReturns > 0}
          />
          <ManagementCard
            title="Exchanges"
            description="Pending exchange requests"
            count={pendingExchanges}
            icon={<Repeat className="h-5 w-5" />}
            href="/admin/exchanges"
            cta="Review"
            color="from-violet-500 to-purple-400"
            highlight={pendingExchanges > 0}
          />
          <ManagementCard
            title="Cancelled"
            description="Cancelled orders total"
            count={cancelledOrders}
            icon={<XCircle className="h-5 w-5" />}
            href="/admin/orders?status=CANCELLED"
            cta="View"
            color="from-slate-500 to-gray-400"
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
  color,
  highlight = false,
}: {
  title: string
  description: string
  count: number
  icon: React.ReactNode
  href: string
  cta: string
  color: string
  highlight?: boolean
}) {
  return (
    <div className={`relative rounded-2xl overflow-hidden border ${highlight ? "border-rose-300 ring-2 ring-rose-200" : "border-[#E8DFD4]"} bg-white shadow-sm`}>
      <div className={`bg-gradient-to-r ${color} p-4 flex items-center gap-3`}>
        <div className="bg-white/20 rounded-lg p-2 text-white">{icon}</div>
        <div>
          <p className="text-white font-semibold text-sm">{title}</p>
          <p className="text-white/75 text-xs">{description}</p>
        </div>
      </div>
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="text-4xl font-bold text-[#3D2B1F]">{count}</span>
        <Link
          href={href}
          className="text-xs font-semibold text-[#8B6F47] hover:text-[#3D2B1F] border border-[#E8DFD4] rounded-lg px-3 py-1.5 hover:border-[#C9A66B] transition-colors"
        >
          {cta} &rarr;
        </Link>
      </div>
    </div>
  )
}
