import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "Return requests are disabled." },
    { status: 410 }
  )
}
