import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { storeMediaFile } from "@/lib/media"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const purpose = file.type.startsWith("video")
      ? "review_video"
      : "review_image"

    const uploaded = await storeMediaFile(file, purpose)

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      type: uploaded.type,
    })
  } catch (error) {
    console.error("Error uploading review media:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload media" },
      { status: 500 }
    )
  }
}
