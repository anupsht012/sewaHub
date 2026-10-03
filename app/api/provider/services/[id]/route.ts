import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
    });
    if (!provider) {
      return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
    }

    const existing = await prisma.service.findFirst({
      where: { id, providerId: provider.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Service not found for this provider" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File | null;
    const removeImage = formData.get("removeImage") as string;

    let imageUrl: string | null | undefined = undefined;

    if (removeImage === "true") {
      imageUrl = null;
    }

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const mimeType = imageFile.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      imageUrl = `data:${mimeType};base64,${base64}`;
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() || null } : {}),
        ...(price ? { price: parseFloat(price) } : {}),
        ...(imageUrl !== undefined ? { image: imageUrl } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("PATCH ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const provider = await prisma.provider.findUnique({ where: { userId: user.id } });
    if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    
    await prisma.service.delete({ where: { id, providerId: provider.id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}