import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { validatePromoCode, isNewUser } from "@/lib/promo-codes"
import {
  cashfreeRequest,
  getBaseUrl,
  isCashfreeConfigured,
} from "@/lib/cashfree"

type CashfreeOrderResponse = {
  cf_order_id: string
  order_id: string
  order_currency: string
  order_amount: number
  payment_session_id: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { addressId, idempotencyKey, promoCode, paymentMethod } =
      await request.json()

    if (paymentMethod === "COD") {
      return NextResponse.json(
        { error: "Cash on Delivery is disabled. Please use online payment." },
        { status: 400 }
      )
    }

    const existingOrder = idempotencyKey
      ? await prisma.order.findUnique({
          where: { id: idempotencyKey },
        })
      : null

    if (existingOrder && existingOrder.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedAddressId = addressId || existingOrder?.shippingAddressId
    if (!resolvedAddressId) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 })
    }

    const address = await prisma.address.findUnique({
      where: { id: resolvedAddressId },
    })

    if (!address) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty. Please add items again." },
        { status: 400 }
      )
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )
    const shipping = 0

    let discount = 0
    let appliedPromoCode: string | null = null

    if (promoCode) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { createdAt: true },
      })

      if (user) {
        const userIsNew = isNewUser(user.createdAt)

        const existingUsage = await prisma.promoCodeUsage.findUnique({
          where: {
            userId_code: {
              userId: session.user.id,
              code: promoCode.toUpperCase().trim(),
            },
          },
        })

        if (existingUsage) {
          return NextResponse.json(
            { error: "This promo code has already been used" },
            { status: 400 }
          )
        }

        const validation = validatePromoCode(promoCode, subtotal, userIsNew)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || "Invalid promo code" },
            { status: 400 }
          )
        }

        discount = validation.discount || 0
        appliedPromoCode = promoCode.toUpperCase().trim()
      }
    }

    const finalAmount = Number((subtotal + shipping - discount).toFixed(2))

    const orderItemsPayload = cartItems.map((ci) => ({
      productId: ci.productId,
      quantity: ci.quantity,
      price: Number(ci.product.price),
      ...(ci.size ? { size: ci.size } : {}),
      ...(ci.color ? { color: ci.color } : {}),
    }))

    if (!isCashfreeConfigured()) {
      return NextResponse.json(
        { error: "Payment gateway is not configured" },
        { status: 500 }
      )
    }

    let order

    if (existingOrder) {
      order = await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          total: finalAmount,
          subtotal,
          tax: 0,
          shipping,
          discount: discount > 0 ? discount : null,
          promoCode: appliedPromoCode,
          addressId: resolvedAddressId,
          shippingAddressId: resolvedAddressId,
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingStreet: address.street,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          shippingCountry: address.country,
          paymentMethod: "ONLINE",
          paymentStatus: "PENDING",
          razorpayPaymentId: null,
        },
      })
    } else {
      order = await prisma.order.create({
        data: {
          userId: session.user.id,
          total: finalAmount,
          subtotal,
          tax: 0,
          shipping,
          discount: discount > 0 ? discount : null,
          promoCode: appliedPromoCode,
          addressId: resolvedAddressId,
          shippingAddressId: resolvedAddressId,
          paymentMethod: "ONLINE",
          paymentStatus: "PENDING",
          status: "PENDING",
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingStreet: address.street,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          shippingCountry: address.country,
          items: { create: orderItemsPayload },
        },
      })
    }

    const returnUrl = new URL(
      `/payment?orderId=${order.id}&verifyCashfree=true`,
      getBaseUrl()
    ).toString()

    const cashfreeOrder = await cashfreeRequest<CashfreeOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify({
        order_id: order.id,
        order_amount: finalAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: session.user.id,
          customer_name: address.name || session.user.name || "Customer",
          customer_email: session.user.email || undefined,
          customer_phone: address.phone,
        },
        order_meta: {
          return_url: returnUrl,
        },
        order_note: `Payment for order ${order.id}`,
      }),
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayOrderId: cashfreeOrder.cf_order_id,
        paymentStatus: "PENDING",
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      cashfreeOrderId: cashfreeOrder.cf_order_id,
      paymentSessionId: cashfreeOrder.payment_session_id,
      amount: cashfreeOrder.order_amount,
      currency: cashfreeOrder.order_currency,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
