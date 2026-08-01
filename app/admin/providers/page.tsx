import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import UnverifyProviderButton from "@/components/admin/UnverifyProviderButton";
import VerifyProviderButton from "@/components/admin/VerifyProviderButton";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProvidersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const providers = await prisma.provider.findMany({
    where: {
      user: {
        role: "PROVIDER",
      },
    },
    include: {
      user: true,
      services: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Providers</h1>
        <p className="mt-2 text-gray-500">
          Verify or manage all registered providers.
        </p>
      </div>

      {providers.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow">
          <h2 className="font-semibold">No providers found.</h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold">{provider.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {provider.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    📍 {provider.location}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {provider.services.length}
                  </TableCell>
                  <TableCell>
                    {provider.verified ? (
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                        Not Verified
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      {provider.verified ? (
                        <UnverifyProviderButton providerId={provider.id} />
                      ) : (
                        <VerifyProviderButton providerId={provider.id} />
                      )}

                      <Link href={`/admin/providers/${provider.id}`}>
                        <Button className="cursor-pointer bg-black hover:bg-amber-950">
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}