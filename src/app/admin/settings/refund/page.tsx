import { Navbar } from "@/components/layout/navbar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RefundSettingsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Refund Settings</h1>
        <p className="text-muted-foreground">
          Refund configuration settings will be available here.
        </p>
      </main>
    </>
  )
}
