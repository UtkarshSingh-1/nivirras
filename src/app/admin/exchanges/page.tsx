import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import ApproveExchangeButton from "./approve-button";
import RejectExchangeButton from "./reject-button";

export default async function AdminExchangesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    return <div>Unauthorized</div>;

  const exchanges = await prisma.exchangeRequest.findMany({
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
      <h1 className="text-2xl font-bold">Exchange Requests</h1>

      {exchanges.map((e) => (
        <div key={e.id} className="p-4 border rounded space-y-2 bg-white dark:bg-neutral-900">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">
                Order #{e.orderId.slice(-6)} by {e.order.user.email}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(e.createdAt)}
              </div>
            </div>
            <Badge>{e.status}</Badge>
          </div>

          <div className="text-sm">Reason: {e.reason}</div>
          <div className="text-sm">
            Item: {e.order.items[0].product.name}
          </div>
          <div className="text-sm">
            Size: {e.oldSize} ➝ {e.newSize}, Color: {e.oldColor} ➝ {e.newColor}
          </div>

          <div className="flex gap-2 mt-2">
            <ApproveExchangeButton id={e.id} />
            <RejectExchangeButton id={e.id} />
            <Link href={`/orders/${e.orderId}`} className="text-blue-600 text-sm underline">
              View Order
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
