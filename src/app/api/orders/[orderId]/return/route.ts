import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Order returns are disabled." },
    { status: 410 }
  )
}
