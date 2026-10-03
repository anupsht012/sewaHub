import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "PROVIDER") {
      return NextResponse.json({ error: "Only providers can create services" }, { status: 403 });
    }

    let name: string, description: string, price: number;
    let imageFile: File | null = null;
    let imageUrlFromBody: string | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name") as string;
      description = (formData.get("description") as string) || "";
      price = Number(formData.get("price"));
      imageFile = formData.get("image") as File | null;
      imageUrlFromBody = formData.get("imageUrl") as string | null;
    } else {
      const body = await req.json();
      name = body.name;
      description = body.description || "";
      price = Number(body.price);
      imageUrlFromBody = body.image || body.imageUrl || null;
    }

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
      select: { id: true, category: true },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
    }

    // FIXED: No mkdir, no writeFile - save as Base64
    let finalImageUrl: string | null = imageUrlFromBody || null;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image must be < 5MB" }, { status: 400 });
      }
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = imageFile.type || "image/jpeg";
      finalImageUrl = `data:${mimeType};base64,${base64}`;
    }

    const [service, admins] = await Promise.all([
      prisma.service.create({
        data: {
          name: name.trim(),
          category: provider.category,
          description: description?.trim() || null,
          price,
          image: finalImageUrl,
          providerId: provider.id,
        },
      }),
      prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      }),
    ]);

    if (admins.length > 0) {
      prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: "New Service Created",
          message: `${user.name} created a new service: ${service.name}`,
          type: "SERVICE_CREATED",
          link: `/admin/services/${service.id}`,
        })),
      }).then(() => {}).catch(console.error);
    }

    return NextResponse.json({ success: true, service }, { status: 201 });

  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}