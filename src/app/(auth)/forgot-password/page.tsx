"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"email" | "verify">("email")
  const [loading, setLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error" | "">("")

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlertMsg("")
    setAlertType("")

    const res = await fetch("/api/auth/forgot-password/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok) {
      setAlertMsg(data.error)
      setAlertType("error")
      setLoading(false)
      return
    }

    setAlertMsg("OTP sent to your email")
    setAlertType("success")
    setStep("verify")
    setLoading(false)
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlertMsg("")
    setAlertType("")

    const res = await fetch("/api/auth/forgot-password/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setAlertMsg(data.error)
      setAlertType("error")
      setLoading(false)
      return
    }

    setAlertMsg("Password updated successfully. You can sign in now.")
    setAlertType("success")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-3xl font-bold text-crimson-600 mb-2">ASHMARK</div>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email to receive an OTP"
              : "Enter OTP and set a new password"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Alerts */}
          {alertMsg && (
            <Alert className={alertType === "success" ? "bg-[#EDF1DB] text-[#4A5422] border-[#D3DAAE]" : "bg-[#EDF1DB] text-[#4A5422] border-[#D3DAAE]"}>
              {alertType === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{alertMsg}</AlertDescription>
            </Alert>
          )}

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <form className="space-y-4" onSubmit={sendOtp}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === "verify" && (
            <form className="space-y-4" onSubmit={resetPassword}>
              <div className="space-y-2">
                <Label>OTP</Label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
