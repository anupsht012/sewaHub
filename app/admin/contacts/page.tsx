import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminContactsClient from "./contacts-client";
import { auth } from "@/lib/auth/auth";

export default async function AdminContactsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const contacts = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <AdminContactsClient initialContacts={contacts} />;
}