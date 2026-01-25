import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { videoUrl, publicId } = await req.json();

    if (!videoUrl || !publicId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.reel.create({
      data: {
        videoUrl,
        // Removed publicId as it's not in the Reel schema type
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
