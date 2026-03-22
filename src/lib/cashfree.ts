import crypto from "crypto"

export type CashfreeMode = "sandbox" | "production"

const DEFAULT_API_VERSION = "2025-01-01"

function normalizeMode(value?: string | null): CashfreeMode {
  return value?.toLowerCase() === "production" ? "production" : "sandbox"
}

export function getCashfreeMode(): CashfreeMode {
  return normalizeMode(
    process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_ENV
  )
}

export function getCashfreeApiVersion() {
  return process.env.CASHFREE_API_VERSION || DEFAULT_API_VERSION
}

export function getCashfreeBaseUrl() {
  return getCashfreeMode() === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg"
}

export function isCashfreeConfigured() {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY)
}

export function getCashfreeHeaders(extra?: HeadersInit) {
  const appId = process.env.CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY

  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials are not configured")
  }

  return {
    "Content-Type": "application/json",
    "x-api-version": getCashfreeApiVersion(),
    "x-client-id": appId,
    "x-client-secret": secretKey,
    ...extra,
  }
}

export async function cashfreeRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${getCashfreeBaseUrl()}${path}`, {
    ...init,
    headers: getCashfreeHeaders(init?.headers),
    cache: "no-store",
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error_description ||
      data?.error ||
      "Cashfree request failed"

    throw new Error(message)
  }

  return data as T
}

export function getBaseUrl() {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3001"
  )
}

export function verifyCashfreeWebhookSignature({
  payload,
  timestamp,
  signature,
}: {
  payload: string
  timestamp: string | null
  signature: string | null
}) {
  const secret = process.env.CASHFREE_SECRET_KEY

  if (!secret || !timestamp || !signature) {
    return false
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}${payload}`)
    .digest("base64")

  return expectedSignature === signature
}
