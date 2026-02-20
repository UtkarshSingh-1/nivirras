"use client"

import { ReactNode } from "react"
import { SWRConfig } from "swr"
import { SWR_DEFAULT_OPTIONS } from "@/lib/client-fetch"

export function SwrProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={SWR_DEFAULT_OPTIONS}>{children}</SWRConfig>
}
