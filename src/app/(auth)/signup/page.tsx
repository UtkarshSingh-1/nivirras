"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()

  const [step, setStep] = useState<"signup" | "verify">("signup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // -------------------- SEND OTP --------------------
  const sendOtp = async () => {
    if (!email) {
      toast({ variant: "destructive", title: "Email is required" })
      return
    }
    if (!password || password.length < 6) {
      toast({ variant: "destructive", title: "Password must be at least 6 characters" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      let data: any = {}
      try {
        data = await res.json()
      } catch {}

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: data?.error || "Failed to send OTP"
        })
      } else {
        toast({ title: "OTP sent to your email" })
        setStep("verify")
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Network error, try again"
      })
    }
    setLoading(false)
  }

  // -------------------- VERIFY OTP --------------------
  const verifyOtp = async () => {
    if (!otp) {
      toast({ variant: "destructive", title: "Please enter OTP" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({ variant: "destructive", title: data.error })
        setLoading(false)
        return
      }

      toast({ title: "Account created successfully" })

      // auto login
      await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      router.push("/")
      router.refresh()
    } catch (err) {
      toast({ variant: "destructive", title: "Something went wrong" })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#F2F4E8] via-[#EDF1DB] to-[#E8ECD6]">
      <Card className="w-full max-w-md border-[#D3DAAE] shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div
            className="text-3xl font-bold text-[#4A5422]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            NIVIRRAS
          </div>
          <CardTitle>Create Your Account</CardTitle>
          <p className="text-sm text-[#4A5422]">
            Join Nivirras Collections and start shopping.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">

          {step === "signup" && (
            <>
              <div>
                <Label className="mb-2 block">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label className="mb-2 block">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label className="mb-2 block">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button className="w-full" onClick={sendOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Verify Email"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-[#636B2F] hover:text-[#4A5422]">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {step === "verify" && (
            <>
              <Label className="mb-2 block">Enter OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6 digit OTP"
              />
              <p className="text-xs text-muted-foreground">
                We sent a verification code to <span className="font-medium">{email}</span>.
              </p>

              <Button className="w-full" onClick={verifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Create Account"}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground"
                onClick={sendOtp}
                disabled={loading}
              >
                Resend OTP
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
