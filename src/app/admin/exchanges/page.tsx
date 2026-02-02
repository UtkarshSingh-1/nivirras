import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Download } from "lucide-react"

import ApproveButton from "./[id]/approve-button"
import RejectButton from "./[id]/reject-button"

import { ExchangeStatus } from "@prisma/client"

type Filter = "ALL" | ExchangeStatus

export default async function AdminExchangesPage({
  searchParams,
}: {
  searchParams?: { status?: Filter }
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const status = searchParams?.status

  const where =
    status && status !== "ALL"
      ? { status: status as ExchangeStatus }
      : {}

  const [exchanges, counts] = await Promise.all([
    prisma.exchangeRequest.findMany({
      where,
      include: {
        order: {
          include: {
            address: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.exchangeRequest.groupBy({
      by: ["status"],
      _count: true,
    }),
  ])

  const countMap = counts.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = c._count
    return acc
  }, {})

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exchange Requests</h1>

        {/* CSV Export */}
        <Button asChild variant="outline">
          <Link href="/api/admin/exchanges?export=csv">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["ALL", "REQUESTED", "APPROVED", "REJECTED"] as Filter[]).map((s) => (
          <Link
            key={s}
            href={`/admin/exchanges${s !== "ALL" ? `?status=${s}` : ""}`}
          >
            <Badge
              variant={status === s || (!status && s === "ALL") ? "default" : "outline"}
              className="cursor-pointer"
            >
              {s} {s !== "ALL" && `(${countMap[s] ?? 0})`}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {exchanges.map((ex) => (
              <tr key={ex.id} className="border-t">
                <td className="p-3 font-medium">{ex.orderId}</td>

                <td className="p-3">
                  {ex.order.userId}
                </td>

                <td className="p-3">
                  {ex.order.address ? (
                    <>
                      <div>{ex.order.address.street}</div>
                      <div className="text-muted-foreground">
                        {ex.order.address.city}, {ex.order.address.pincode}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">No address</span>
                  )}
                </td>

                <td className="p-3">
                  {ex.order.items.map((item) => (
                    <div key={item.id}>
                      {item.product.name} × {item.quantity}
                    </div>
                  ))}
                </td>

                <td className="p-3">
                  <Badge
                    variant={
                      ex.status === "REQUESTED"
                        ? "outline"
                        : ex.status === "APPROVED"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {ex.status}
                  </Badge>
                </td>

                <td className="p-3 flex gap-2">
                  {ex.status === "REQUESTED" && (
                    <>
                      <ApproveButton id={ex.id} />
                      <RejectButton id={ex.id} />
                    </>
                  )}
                  {ex.status !== "REQUESTED" && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <RefreshCcw className="h-4 w-4" />
                      Processed
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {exchanges.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No exchange requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
