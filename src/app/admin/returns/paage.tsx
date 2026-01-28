import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ApproveReturnButton from "./approve-button";
import RejectReturnButton from "./reject-button";

export default async function AdminReturnsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    return <div>Unauthorized</div>;

  const returns = await prisma.returnRequest.findMany({
    include: {
      order: {
        include: {
          user: true,
          items: { include: { product: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Return Requests</h1>

      {returns.map((r) => (
        <div key={r.id} className="p-4 border rounded space-y-2 bg-white dark:bg-neutral-900">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">
                Order #{r.orderId.slice(-6)} by {r.order.user.email}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(r.createdAt)}
              </div>
            </div>
            <Badge>{r.status}</Badge>
          </div>

          <div className="text-sm">Reason: {r.reason}</div>

          <div className="text-sm">
            Item: {r.order.items[0].product.name}
          </div>

          <div className="flex gap-2 mt-2">
            <ApproveReturnButton id={r.id} />
            <RejectReturnButton id={r.id} />
            <Link href={`/orders/${r.orderId}`} className="text-blue-600 text-sm underline">
              View Order
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
