import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClient, Gender } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth/auth"; // Adjust import path to your BetterAuth configuration

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function PATCH(request: Request) {
  try {
    const reqHeaders = await headers();

    // 1. Authenticate with BetterAuth
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    let userId = session?.user?.id || null;

    const contentType = request.headers.get("content-type") || "";

    let name: string | null = null;
    let phone: string | null = null;
    let gender: string | null = null;
    let dateOfBirth: string | null = null;
    let bio: string | null = null;
    let image: string | null = null;

    // 2. Parse JSON Payload
    if (contentType.includes("application/json")) {
      const json = await request.json();
      name = json.name ?? null;
      phone = json.phone ?? null;
      gender = json.gender ?? null;
      dateOfBirth = json.dateOfBirth ?? null;
      bio = json.bio ?? null;
      image = json.image ?? null;
      if (json.userId && !userId) userId = json.userId;
    } 
    // 3. Parse Multipart Form Payload
    else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      name = (formData.get("name") as string) || null;
      phone = (formData.get("phone") as string) || null;
      gender = (formData.get("gender") as string) || null;
      dateOfBirth = (formData.get("dateOfBirth") as string) || null;
      bio = (formData.get("bio") as string) || null;

      if (formData.get("userId") && !userId) {
        userId = formData.get("userId") as string;
      }

      const imageField = formData.get("image");
      if (typeof imageField === "string") {
        image = imageField;
      } else if (imageField && imageField instanceof File) {
        const bytes = await imageField.arrayBuffer();
        const buffer = Buffer.from(bytes);
        image = `data:${imageField.type};base64,${buffer.toString("base64")}`;
      }
    } else {
      return NextResponse.json(
        { message: `Unsupported Content-Type: ${contentType}` },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Missing active user session" },
        { status: 401 }
      );
    }

    // 4. Build update object dynamically with explicit Gender enum casting
    const updateData: {
      name?: string;
      phone?: string | null;
      gender?: Gender | null;
      dateOfBirth?: Date | null;
      bio?: string | null;
      image?: string;
    } = {};

    if (name && name.trim() !== "") {
      updateData.name = name;
    }

    if (phone !== null) {
      updateData.phone = phone.trim() !== "" ? phone : null;
    }

    if (gender !== null) {
      updateData.gender = gender.trim() !== "" ? (gender as Gender) : null;
    }

    if (dateOfBirth !== null) {
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }

    if (bio !== null) {
      updateData.bio = bio.trim() !== "" ? bio : null;
    }

    if (image !== null && image !== undefined) {
      updateData.image = image;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // 5. Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    return NextResponse.json({
      message: "Personal information updated successfully",
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Profile update error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { message: `Failed to update personal information: ${message}` },
      { status: 500 }
    );
  }
}