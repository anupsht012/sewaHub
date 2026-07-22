import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {

  const body = await req.json();

  const { email, password } = body;


  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });


  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 400,
      }
    );
  }


  const passwordMatch = await bcrypt.compare(
    password,
    user.password!
  );


  if (!passwordMatch) {
    return NextResponse.json(
      {
        message: "Invalid password",
      },
      {
        status: 400,
      }
    );
  }


  const sessionToken = crypto
    .randomBytes(32)
    .toString("hex");


  await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
      ),
      id: sessionToken,
    },
  });


 const response = NextResponse.json({
  success: true,
  user,
});

response.cookies.set("session", sessionToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return response;
}