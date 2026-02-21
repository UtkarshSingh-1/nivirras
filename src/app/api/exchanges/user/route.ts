import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "Exchange requests are disabled." },
    { status: 410 }
  )
}
