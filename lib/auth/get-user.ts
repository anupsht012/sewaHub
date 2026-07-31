import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {

  console.log("GET CURRENT USER START");


  const requestHeaders = await headers();


  console.log("HEADERS RECEIVED");


  const session = await auth.api.getSession({
    headers: requestHeaders,
  });


  console.log("SESSION:", session);


  return session?.user ?? null;
}