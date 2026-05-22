export type CashfreeCheckoutResult = {
  error?: {
    message?: string
  }
  redirect?: boolean
}

type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal" | string
  }) => Promise<CashfreeCheckoutResult>
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => CashfreeInstance
  }
}

const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js"

let sdkPromise: Promise<void> | null = null

export function loadCashfreeSdk() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cashfree SDK can only load in the browser"))
  }

  if (window.Cashfree) {
    return Promise.resolve()
  }

  if (!sdkPromise) {
    sdkPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${CASHFREE_SDK_URL}"]`
      )

      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true })
        existing.addEventListener(
          "error",
          () => reject(new Error("Failed to load Cashfree SDK")),
          { once: true }
        )
        return
      }

      const script = document.createElement("script")
      script.src = CASHFREE_SDK_URL
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Cashfree SDK"))
      document.head.appendChild(script)
    })
  }

  return sdkPromise
}
