import { redirect } from "next/navigation"

export default function ReturnsExchangesDebugPage() {
  redirect("/admin/orders")
}
