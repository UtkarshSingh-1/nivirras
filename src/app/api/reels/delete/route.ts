import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import axios from "axios";

export async function POST(req: Request) {
  const { id, publicId } = await req.json();

  if (!id || !publicId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Delete from DB
  await prisma.reel.delete({ where: { id } });

  // Delete from Cloudinary
  await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/video/delete_by_token`,
    { public_id: publicId },
    {
      auth: {
        username: process.env.CLOUDINARY_API_KEY!,
        password: process.env.CLOUDINARY_API_SECRET!,
      },
    }
  );

  return NextResponse.json({ success: true });
}
