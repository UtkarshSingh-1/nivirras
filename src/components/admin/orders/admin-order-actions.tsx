"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Edit, Truck, PackageCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminOrderActionsProps {
  order: {
    id: string
    status: string
  }
}

export function AdminOrderActions({ order }: AdminOrderActionsProps) {
  const [loading, setLoading] = useState(false)
  const [showShipForm, setShowShipForm] = useState(false)
  const [courierName, setCourierName] = useState("")
  const [trackingId, setTrackingId] = useState("")
  const router = useRouter()

  const updateOrderStatus = async (status: string, data: Record<string, any> = {}) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...data }),
      })

      if (!response.ok) throw new Error()
      toast({ title: "Success", description: `Status changed to ${status}` })
      router.refresh()
    } catch {
      toast({ title: "Error", description: "Unable to update", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const shipOrder = async () => {
    if (!courierName || !trackingId) {
      toast({ title: "Missing Info", description: "Courier + Tracking Required", variant: "destructive" })
      return
    }
    await updateOrderStatus("SHIPPED", { courierName, trackingId })
  }

  const normalFlowButtons = () => {
    switch (order.status) {
      case "PENDING":
        return (
          <Button className="w-full" disabled={loading} onClick={() => updateOrderStatus("CONFIRMED")}>
            Confirm Order
          </Button>
        )
      case "CONFIRMED":
      case "PROCESSING":
        return (
          <Button className="w-full" disabled={loading} onClick={() => setShowShipForm(true)}>
            <Truck className="w-4 h-4 mr-2" /> Mark as Shipped
          </Button>
        )
      case "SHIPPED":
        return (
          <Button className="w-full" disabled={loading} onClick={() => updateOrderStatus("DELIVERED")}>
            <PackageCheck className="w-4 h-4 mr-2" /> Mark as Delivered
          </Button>
        )
      case "DELIVERED":
        return <Badge className="bg-[#636B2F]">Delivered</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" /> Order Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge className="bg-black text-white">{order.status}</Badge>
          {normalFlowButtons()}
        </CardContent>
      </Card>

      {showShipForm && (
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>Courier Name</Label>
            <Input value={courierName} onChange={(e) => setCourierName(e.target.value)} />
            <Label>Tracking ID</Label>
            <Input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
            <Button className="w-full" disabled={loading} onClick={shipOrder}>
              Save & Ship
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowShipForm(false)}>
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
