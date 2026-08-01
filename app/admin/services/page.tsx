import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import { Button } from "@/components/ui/button";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Star, Eye, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

interface AdminServicesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function AdminServicesPage({
  searchParams,
}: AdminServicesPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));

  // Fetch paginated services and total count concurrently
  const [services, totalCount] = await Promise.all([
    prisma.service.findMany({
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        provider: {
          include: {
            user: true,
          },
        },
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.service.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const createPaginationUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Service Management
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-600">
                {totalCount} Listed Services
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Manage Services
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review, inspect, and moderate active services offered on KaamSewa.
            </p>
          </div>
        </div>

        {/* Card Wrapped Table Container */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
          <CardContent className="p-0">
            {services.length === 0 ? (
              <div className="py-12 text-center text-sm font-medium text-slate-500">
                No active services found.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="font-bold text-slate-700">Service</TableHead>
                      <TableHead className="font-bold text-slate-700">Provider</TableHead>
                      <TableHead className="font-bold text-slate-700">Category</TableHead>
                      <TableHead className="font-bold text-slate-700">Price</TableHead>
                      <TableHead className="font-bold text-slate-700">Rating</TableHead>
                      <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => {
                      const averageRating =
                        service.reviews.length === 0
                          ? 0
                          : (
                              service.reviews.reduce(
                                (sum, review) => sum + review.rating,
                                0
                              ) / service.reviews.length
                            ).toFixed(1);

                      return (
                        <TableRow
                          key={service.id}
                          className="border-slate-100 transition-colors hover:bg-slate-50/60"
                        >
                          <TableCell className="font-semibold text-slate-900">
                            {service.name}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-slate-600">
                            {service.provider.user.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-slate-200 bg-slate-50 capitalize text-slate-700"
                            >
                              <Briefcase className="mr-1 h-3 w-3 text-slate-500" />
                              {service.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-extrabold text-slate-900">
                            Rs. {service.price.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold text-amber-700">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span>{averageRating}</span>
                              <span className="text-xs font-normal text-slate-400">
                                ({service.reviews.length})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/services/${service.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <Eye className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                                  View
                                </Button>
                              </Link>
                              <DeleteServiceButton serviceId={service.id} />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-4 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
                      <span className="font-semibold text-slate-900">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-2">
                      {currentPage > 1 ? (
                        <Link
                          href={createPaginationUrl(currentPage - 1)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </button>
                      )}

                      {currentPage < totalPages ? (
                        <Link
                          href={createPaginationUrl(currentPage + 1)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}