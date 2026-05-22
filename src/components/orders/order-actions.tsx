"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download } from "lucide-react"

export function OrderActions({}: { order?: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-[#EDF1DB] text-[#313919] hover:bg-[#DDE4BE]">
          <Download className="w-4 h-4 mr-2" /> Download Invoice
        </Button>
        <Separator className="my-4" />
      </CardContent>
    </Card>
  )
}
