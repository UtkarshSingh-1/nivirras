import { handlers } from "@/lib/auth"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    return await handlers.GET(req)
  } catch (error) {
    console.error("[auth][GET] unhandled error:", error)
    return NextResponse.json(
      { error: "Auth endpoint failure" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handlers.POST(req)
  } catch (error) {
    console.error("[auth][POST] unhandled error:", error)
    return NextResponse.json(
      { error: "Auth endpoint failure" },
      { status: 500 }
    )
  }
}
