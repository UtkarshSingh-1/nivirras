"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CreditCard, Wallet, Shield, AlertCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { loadCashfreeSdk } from "@/lib/cashfree-js"

interface PaymentFormProps {
  order?: {
    id: string
    total: number
    razorpayOrderId?: string | null
    paymentStatus: string
    items: Array<{
      product: {
        name: string
      }
    }>
  } | null
  isRetry?: boolean
  shouldVerify?: boolean
}

export function PaymentForm({
  order,
  isRetry = false,
  shouldVerify = false,
}: PaymentFormProps) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [verifying, setVerifying] = useState(shouldVerify)
  const [sdkReady, setSdkReady] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<
    "card" | "upi" | "netbanking" | "wallet"
  >("card")

  useEffect(() => {
    if (shouldVerify || !order) return

    loadCashfreeSdk()
      .then(() => setSdkReady(true))
      .catch(() => {
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load payment options. Please refresh the page.",
          variant: "destructive",
        })
      })
  }, [order, shouldVerify])

  useEffect(() => {
    if (!shouldVerify || !order) return

    let active = true

    const verifyPayment = async () => {
      try {
        const verifyResponse = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        })

        const result = await verifyResponse.json()
        if (!active) return

        if (verifyResponse.ok && result.success) {
          toast({
            title: "Payment Successful!",
            description: "Your order has been confirmed.",
          })
          router.replace(`/orders/${order.id}`)
          return
        }

        toast({
          title:
            result.paymentStatus === "FAILED" ? "Payment Failed" : "Payment Pending",
          description:
            result.paymentMessage ||
            (result.paymentStatus === "FAILED"
              ? "Please try again."
              : "We could not confirm the payment yet. Please retry in a moment."),
          ...(result.paymentStatus === "FAILED"
            ? { variant: "destructive" as const }
            : {}),
        })
      } catch (error) {
        console.error("Payment verification error:", error)
        if (!active) return
        toast({
          title: "Verification Failed",
          description: "We could not confirm the payment status. Please try again.",
          variant: "destructive",
        })
      } finally {
        if (active) {
          setVerifying(false)
        }
      }
    }

    verifyPayment()

    return () => {
      active = false
    }
  }, [order, router, shouldVerify])

  if (verifying) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">Verifying payment</h3>
          <p className="text-muted-foreground">
            Please wait while we confirm your Cashfree payment.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!order) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No order found</h3>
          <p className="text-muted-foreground mb-6">
            Please create an order first before proceeding to payment.
          </p>
          <Button asChild className="bg-crimson-600 hover:bg-crimson-700 border-0">
            <Link href="/cart">Go to Cart</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handlePayment = async () => {
    if (processing) return

    setProcessing(true)

    try {
      await loadCashfreeSdk()
      setSdkReady(true)

      if (!window.Cashfree) {
        throw new Error("Cashfree SDK is unavailable")
      }

      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: order.id,
          paymentMethod: "ONLINE",
        }),
      })

      const orderData = await orderResponse.json()
      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create payment session")
      }

      const cashfree = window.Cashfree({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox",
      })

      const result = await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: "_self",
      })

      if (result?.error?.message) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isRetry ? "Retry Payment" : "Complete Payment"}</CardTitle>
            {isRetry && <Badge className="bg-[#8A9353] border-0">Retry</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-medium">#{order.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{order.items.length} items</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-crimson-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Select Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                id: "card",
                icon: CreditCard,
                label: "Credit/Debit Card",
                desc: "Visa, Mastercard, RuPay",
              },
              {
                id: "upi",
                icon: Wallet,
                label: "UPI",
                desc: "Google Pay, PhonePe, Paytm",
              },
              {
                id: "netbanking",
                icon: Shield,
                label: "Net Banking",
                desc: "All major banks",
              },
              {
                id: "wallet",
                icon: Wallet,
                label: "Wallets",
                desc: "Paytm, Mobikwik, etc.",
              },
            ].map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  className={`p-4 border-2 cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? "border-crimson-600 bg-crimson-50 dark:bg-crimson-900/20"
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setSelectedMethod(method.id as typeof selectedMethod)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-muted-foreground">{method.desc}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#636B2F] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#636B2F] mb-1">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted and secure. We use
                industry-standard security measures to protect your financial data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <Button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-crimson-600 hover:bg-crimson-700 border-0"
            size="lg"
          >
            {processing ? "Processing Payment..." : `Pay ${formatPrice(order.total)}`}
          </Button>

          {!sdkReady && (
            <p className="text-sm text-[#4A5422] mt-2 text-center">
              Loading Cashfree checkout...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
