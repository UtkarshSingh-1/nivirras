export const SWR_DEFAULT_OPTIONS = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 30_000,
  focusThrottleInterval: 60_000,
}

export async function clientFetcher<T = unknown>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "same-origin" })
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}
