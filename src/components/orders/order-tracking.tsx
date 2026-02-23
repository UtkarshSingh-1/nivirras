import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Package, MapPin } from "lucide-react";

interface OrderTrackingProps {
  order: any;
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const steps = [
    {
      key: "CONFIRMED",
      title: "Order Confirmed",
      desc: "We have received your order",
      icon: CheckCircle
    },
    {
      key: "PROCESSING",
      title: "Processing",
      desc: "Your order is being packed",
      icon: Package
    },
    {
      key: "SHIPPED",
      title: "Shipped",
      desc: "On the way via courier",
      icon: Truck
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      desc: "Package delivered successfully",
      icon: MapPin
    },
  ];

  const completedIndex = steps.findIndex(s => s.key === order.status);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= completedIndex;

            return (
              <div key={step.key} className="flex gap-3 items-start">
                <Icon className={`w-5 h-5 ${isCompleted ? "text-[#636B2F]" : "text-[#8A9353]"}`} />
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {step.title}
                    {index === completedIndex && <Badge>Current</Badge>}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {order.status === "SHIPPED" && (
          <div className="p-3 bg-[#EDF1DB] text-sm rounded border">
            Tracking ID: <b>{order.trackingId || "Updating"}</b>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
