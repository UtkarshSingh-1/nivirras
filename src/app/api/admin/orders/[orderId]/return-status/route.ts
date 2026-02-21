import { NextResponse } from "next/server"

export async function PATCH() {
  return NextResponse.json(
    { error: "Return status updates are disabled." },
    { status: 410 }
  )
}
