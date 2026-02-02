import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

type ReturnStatus = "REQUESTED" | "APPROVED" | "REJECTED"

export default async function AdminReturnsPage(props: any) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  /* ---------------------------------------------
     NEXT 15 SAFE searchParams HANDLING
  --------------------------------------------- */
  const rawParams =
    typeof props?.searchParams?.then === "function"
      ? await props.searchParams
      : props?.searchParams ?? {}

  const status = rawParams.status as ReturnStatus | undefined

  /* ---------------------------------------------
     DATA
  --------------------------------------------- */
  const returns = await prisma.returnRequest.findMany({
    where: status ? { status } : undefined,
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
      user: true,
    },
    orderBy: { createdAt: "desc" },
  })

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Return Requests</h1>

          <div className="flex gap-2">
            <Link href="/admin/returns">
              <Button variant={!status ? "default" : "outline"}>All</Button>
            </Link>

            <Link href="/admin/returns?status=REQUESTED">
              <Button variant={status === "REQUESTED" ? "default" : "outline"}>
                Pending
              </Button>
            </Link>

            <Link href="/admin/returns?status=APPROVED">
              <Button variant={status === "APPROVED" ? "default" : "outline"}>
                Approved
              </Button>
            </Link>

            <Link href="/admin/returns?status=REJECTED">
              <Button variant={status === "REJECTED" ? "default" : "outline"}>
                Rejected
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {returns.map((ret) => (
            <div
              key={ret.id}
              className="border rounded-lg p-4 bg-background"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">Order #{ret.orderId}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(ret.createdAt, "dd MMM yyyy")}
                  </p>
                </div>

                <Badge
                  variant={
                    ret.status === "REQUESTED"
                      ? "secondary"
                      : ret.status === "APPROVED"
                      ? "default"
                      : "destructive"
                  }
                >
                  {ret.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Customer: {ret.user.email}
              </p>

              {/* Address (null-safe) */}
              {ret.order.address && (
                <div className="text-sm mb-3">
                  <p className="font-medium">Pickup Address</p>
                  <p>
                    {ret.order.address.street},{" "}
                    {ret.order.address.city},{" "}
                    {ret.order.address.state} -{" "}
                    {ret.order.address.pincode}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-1 text-sm">
                {ret.order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>₹{Number(item.product.price)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Link href={`/admin/returns/${ret.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}

          {returns.length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              No return requests found.
            </p>
          )}
        </div>
      </main>
    </>
  )
}
