import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  return session?.user ?? null;
});