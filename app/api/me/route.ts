import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const revalidate = 0; // always fresh but cached in wrapper

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return NextResponse.json({ user: session?.user ?? null });
}