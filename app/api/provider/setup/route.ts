import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
    });

    if (!provider) return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });

    return NextResponse.json({ success: true, category: provider.category, provider }, { status: 200 });
  } catch (error) {
    console.error("GET PROVIDER ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "PROVIDER") return NextResponse.json({ error: "Only providers can create profiles" }, { status: 403 });

    // ✅ Handle both FormData (with cover image) and JSON (old)
    let bio = "";
    let location = "";
    let category = "";
    let coverImagePath: string | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      bio = (fd.get("bio") as string) || "";
      location = (fd.get("location") as string) || "";
      category = (fd.get("category") as string) || "";
      const file = fd.get("coverImage") as File | null;

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
        coverImagePath = `/uploads/providers/${fileName}`;
      }
    } else {
      const body = await req.json();
      bio = body.bio || "";
      location = body.location || "";
      category = body.category || "";
    }

    if (!location) return NextResponse.json({ error: "Location is required" }, { status: 400 });
    if (!category) return NextResponse.json({ error: "Provider category is required" }, { status: 400 });

    const existing = await prisma.provider.findUnique({ where: { userId: user.id } });
    if (existing) {
      // ✅ Allow update instead of blocking — so provider can add cover later
      const updated = await prisma.provider.update({
        where: { userId: user.id },
        data: {
          bio,
          location,
          category,
          ...(coverImagePath ? { coverImage: coverImagePath } : {}),
        },
      });
      return NextResponse.json({ success: true, provider: updated }, { status: 200 });
    }

    const provider = await prisma.provider.create({
      data: {
        userId: user.id,
        bio,
        location,
        category,
        coverImage: coverImagePath,
      },
    });

    return NextResponse.json({ success: true, provider }, { status: 201 });
  } catch (error) {
    console.error("PROVIDER SETUP ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}