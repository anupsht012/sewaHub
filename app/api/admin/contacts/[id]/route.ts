import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if ((session?.user as any)?.role!== "ADMIN") return null;
  return session;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  console.log("Deleting contact:", id);

  await prisma.contactMessage.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}