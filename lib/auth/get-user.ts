import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {



  const requestHeaders = await headers();




  const session = await auth.api.getSession({
    headers: requestHeaders,
  });




  return session?.user ?? null;
}