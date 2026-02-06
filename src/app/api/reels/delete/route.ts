import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const reel = await prisma.reel.findUnique({
    where: { id },
    select: { mediaId: true },
  });

  await prisma.reel.delete({ where: { id } });

  if (reel?.mediaId) {
    await prisma.media.deleteMany({ where: { id: reel.mediaId } });
  }

  return NextResponse.json({ success: true });
}
