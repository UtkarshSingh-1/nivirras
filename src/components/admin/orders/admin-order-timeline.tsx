"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, Truck, CheckCircle, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface AdminOrderTimelineProps {
  order: {
    status: string
    paymentStatus: string
    createdAt: string
    updatedAt: string
    shippedAt?: string | null
    deliveredAt?: string | null
  }
}

export function AdminOrderTimeline({ order }: AdminOrderTimelineProps) {
  const timeline = [
    {
      status: "PENDING",
      title: "Order Placed",
      description: "Order has been placed by customer",
      timestamp: order.createdAt,
      icon: Package,
    },
    {
      status: "CONFIRMED",
      title: "Order Confirmed",
      description: "Order has been confirmed",
      icon: CheckCircle,
    },
    {
      status: "PROCESSING",
      title: "Processing",
      description: "Order is being prepared",
      icon: Package,
    },
    {
      status: "SHIPPED",
      title: "Shipped",
      description: "Order left warehouse",
      timestamp: order.shippedAt || null,
      icon: Truck,
    },
    {
      status: "DELIVERED",
      title: "Delivered",
      description: "Order delivered to customer",
      timestamp: order.deliveredAt || null,
      icon: MapPin,
    },
  ]

  const currentIndex = timeline.findIndex((e) => e.status === order.status)

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Order Timeline
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {timeline.map((event, index) => {
            const Icon = event.icon
            const isCurrent = event.status === order.status
            const isCompleted = currentIndex >= 0 && index <= currentIndex

            return (
              <div key={event.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`p-3 rounded-full text-white ${
                      isCompleted ? "bg-[#636B2F]" : isCurrent ? "bg-[#8A9353]" : "bg-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 h-12 ${isCompleted ? "bg-[#636B2F]" : "bg-gray-300"}`} />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <h4 className="font-semibold flex items-center gap-2">
                    {event.title}
                    {isCurrent && <Badge className="bg-[#8A9353] border-0">Current</Badge>}
                    {isCompleted && !isCurrent && (
                      <Badge className="bg-[#636B2F] border-0 text-white">Completed</Badge>
                    )}
                  </h4>

                  <p className="text-sm text-muted-foreground">{event.description}</p>

                  {(event.timestamp || isCompleted || isCurrent) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.timestamp
                        ? formatDate(new Date(event.timestamp))
                        : formatDate(new Date(order.updatedAt))}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-md text-sm space-y-1">
          <div><strong>Order Created:</strong> {formatDate(new Date(order.createdAt))}</div>
          <div><strong>Last Updated:</strong> {formatDate(new Date(order.updatedAt))}</div>
          <div><strong>Status:</strong> {order.status}</div>
          <div><strong>Payment:</strong> {order.paymentStatus}</div>
        </div>
      </CardContent>
    </Card>
  )
}
