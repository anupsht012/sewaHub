import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  const session = await auth.api.getSession({
    headers: req.headers,
  });


  if (!session?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }


  const { role } = await req.json();


  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      role,
    },
  });


  return NextResponse.json({
    success: true,
  });
}