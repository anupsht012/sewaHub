import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import UnverifyProviderButton from "@/components/admin/UnverifyProviderButton";
import VerifyProviderButton from "@/components/admin/VerifyProviderButton";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sparkles, MapPin, Briefcase, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Provider Directory
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-600">
                {providers.length} Total Providers
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Manage Providers
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Verify or manage all registered providers.
            </p>
          </div>
        </div>

        {/* Card Wrapped Table Container */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="font-bold text-slate-700">Provider</TableHead>
                  <TableHead className="font-bold text-slate-700">Location</TableHead>
                  <TableHead className="font-bold text-slate-700">Services</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                      No providers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  providers.map((provider) => (
                    <TableRow
                      key={provider.id}
                      className="border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      <TableCell>
                        <div>
                          <p className="font-bold text-slate-900">{provider.user.name}</p>
                          <p className="text-sm font-medium text-slate-500">
                            {provider.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {provider.location}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                          {provider.services.length}
                        </span>
                      </TableCell>
                      <TableCell>
                        {provider.verified ? (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50/50 text-emerald-700 font-medium">
                            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-200 bg-amber-50/50 text-amber-700 font-medium">
                            <XCircle className="mr-1 h-3 w-3 text-amber-600" />
                            Not Verified
                          </Badge>
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}