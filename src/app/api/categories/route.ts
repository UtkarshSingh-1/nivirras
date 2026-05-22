import { NextResponse } from "next/server"
import { getPublicCategories } from "@/lib/server-data"

export async function GET() {
  try {
    const categories = await getPublicCategories()
    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ categories: [] }, { status: 200 })
  }
}

