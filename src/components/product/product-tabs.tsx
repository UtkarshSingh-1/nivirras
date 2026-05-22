"use client"

interface ProductTabsProps {
  product: {
    id: string
    name: string
    description?: string | null
  }
}

// Story tab removed. This component is kept as a placeholder for future tabs (e.g. ingredients, care guide).
export function ProductTabs({ product }: ProductTabsProps) {
  return null
}
