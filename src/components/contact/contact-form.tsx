"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

type FormState = {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) {
        setStatus({ type: "error", message: data.error || "Failed to send message." })
        return
      }

      setStatus({ type: "success", message: data.message || "Message sent." })
      setForm(initialState)
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
            First Name
          </label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            placeholder="Priya"
            className="border-[#D3DAAE] focus-visible:ring-[#8A9353]"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
            Last Name
          </label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            placeholder="Sharma"
            className="border-[#D3DAAE] focus-visible:ring-[#8A9353]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="priya@example.com"
          className="border-[#D3DAAE] focus-visible:ring-[#8A9353]"
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
          Subject
        </label>
        <Input
          id="subject"
          value={form.subject}
          onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
          placeholder="Question about my order"
          className="border-[#D3DAAE] focus-visible:ring-[#8A9353]"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
          Message
        </label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          placeholder="Tell us how we can help..."
          className="min-h-[130px] border-[#D3DAAE] focus-visible:ring-[#8A9353]"
          required
        />
      </div>

      {status && (
        <p className={status.type === "success" ? "text-sm text-[#636B2F]" : "text-sm text-[#4A5422]"}>
          {status.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#636B2F] py-5 text-white hover:bg-[#4A5422] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}

