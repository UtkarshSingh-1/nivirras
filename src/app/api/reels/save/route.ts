import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { videoUrl, publicId } = await req.json();

  if (!videoUrl || !publicId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.reel.create({
    data: { videoUrl, publicId }
  });

  return NextResponse.json({ success: true });
}
