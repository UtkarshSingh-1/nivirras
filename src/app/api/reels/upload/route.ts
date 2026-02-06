import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { storeMediaFile } from "@/lib/media"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const uploaded = await storeMediaFile(file, "reel_video")

    return NextResponse.json({
      success: true,
      mediaId: uploaded.id,
      url: uploaded.url,
      type: uploaded.type,
    })
  } catch (error) {
    console.error("Error uploading reel:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload reel" },
      { status: 500 }
    )
  }
}
