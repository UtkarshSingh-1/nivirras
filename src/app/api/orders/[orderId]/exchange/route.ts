import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Order exchanges are disabled." },
    { status: 410 }
  )
}
