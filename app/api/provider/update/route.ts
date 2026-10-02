import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fd = await req.formData();
    const bio = fd.get("bio") as string;
    const location = fd.get("location") as string;
    const category = fd.get("category") as string;
    const file = fd.get("coverImage") as File | null;

    let coverImage: string | undefined;

    if (file && file.size > 0) {
      if (file.size > 3 * 1024 * 1024) {
        return NextResponse.json({ error: "Cover max 3MB" }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      const dir = path.join(process.cwd(), "public/uploads/providers");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, fileName), buffer);
      coverImage = `/uploads/providers/${fileName}`;
    }

    const provider = await prisma.provider.update({
      where: { userId: user.id },
      data: {
        ...(bio !== null && { bio }),
        ...(location && { location }),
        ...(category && { category }),
        ...(coverImage && { coverImage }),
      },
    });

    return NextResponse.json({ success: true, provider }, { status: 200 });

  } catch (error) {
    console.error("PROVIDER UPDATE ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}