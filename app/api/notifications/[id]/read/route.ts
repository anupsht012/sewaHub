import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  await prisma.notification.updateMany({
    where: {
      id,
      userId: user.id,
    },
    data: {
      isRead: true,
    },
  });

  return NextResponse.json({
    success: true,
  });
}