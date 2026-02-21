import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Refunds are disabled." },
    { status: 410 }
  )
}
