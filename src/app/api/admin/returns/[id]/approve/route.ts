import { prisma } from "@/lib/db";
import { refundToOriginal } from "@/lib/razorpay-refund";
import { creditWallet } from "@/lib/wallet";

export async function POST(req: Request, { params }: any) {
  const { id } = await params;

  const ret = await prisma.returnRequest.findUnique({
    where: { id },
    include: { order: true }
  });

  if (!ret) return Response.json({ error: "Not found" }, { status: 404 });

  const order = ret.order;

  // COD CASE → WALLET CREDIT
  if (order.paymentMethod === "COD") {
    await creditWallet(order.userId, order.id, Number(order.total));
    await prisma.order.update({
      where: { id: order.id },
      data: {
        refundMethod: "WALLET",
        refundStatus: "COMPLETED",
        refundAmount: order.total,
      },
    });
  }

  // PREPAID CASE → RAZORPAY REFUND
  if (order.paymentMethod === "ONLINE") {
    const result = await refundToOriginal(order.razorpayPaymentId!, Number(order.total));
    await prisma.order.update({
      where: { id: order.id },
      data: {
        refundMethod: "ORIGINAL_SOURCE",
        refundStatus: result.success ? "COMPLETED" : "INITIATED",
        refundAmount: order.total,
      },
    });
  }

  await prisma.returnRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return Response.json({ success: true });
}
