import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  User,
  Calendar,
  Sparkles,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

export default async function ProviderReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!provider) {
    redirect("/provider");
  }

  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const reviews = await prisma.review.findMany({
    where: {
      service: {
        providerId: provider.id,
      },
    },
    include: {
      customer: true,
      service: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  const total = await prisma.review.count({
    where: {
      service: {
        providerId: provider.id,
      },
    },
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1 text-blue-600" /> Customer Feedback
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Received Reviews
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            View ratings, comments, and feedback provided by your clients.
          </p>
        </div>

        {/* Content Section */}
        {reviews.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-base font-bold text-slate-900">
              No reviews received yet
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't received any reviews yet. When customers rate your services, their feedback will appear here.
            </p>
          </Card>
        ) : (
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  Customer Feedback
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200/80 font-bold text-xs gap-1 px-2.5 py-1"
                >
                  <Sparkles className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {total} {total === 1 ? "Review" : "Reviews"} Total
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 sm:p-6">
              <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <div className="w-full max-w-full overflow-x-auto">
                  <Table className="min-w-[800px] w-full">
                    <TableHeader className="bg-slate-50/80">
                      <TableRow className="border-b border-slate-100">
                        <TableHead className="font-semibold text-slate-700 text-xs whitespace-nowrap bg-slate-50">
                          Customer
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs whitespace-nowrap bg-slate-50">
                          Service
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs whitespace-nowrap bg-slate-50">
                          Rating
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs whitespace-nowrap bg-slate-50">
                          Comment
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs whitespace-nowrap bg-slate-50">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => {
                        const customerName = review.customer.name || "Customer";

                        return (
                          <TableRow
                            key={review.id}
                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7 border border-slate-200 shrink-0">
                                  <AvatarImage
                                    src={review.customer.image || ""}
                                    alt={customerName}
                                  />
                                  <AvatarFallback className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                                    {customerName.charAt(0).toUpperCase() || (
                                      <User className="h-3 w-3" />
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-slate-800 text-xs">
                                  {customerName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                              {review.service.name}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                <span className="text-xs font-bold">
                                  {review.rating}.0
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[220px] truncate text-xs text-slate-600 font-medium">
                              <div className="truncate" title={review.comment || "-"}>
                                {review.comment ? (
                                  review.comment
                                ) : (
                                  <span className="text-slate-400 italic">
                                    No comment provided
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 font-medium whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                {review.createdAt.toLocaleDateString()}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination Section */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 mt-5 px-2 pb-2 sm:pb-0">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing Page{" "}
                    <span className="font-bold text-slate-700">{currentPage}</span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-700">{totalPages}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {currentPage > 1 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-medium gap-1 rounded-lg"
                      >
                        <Link href={`?page=${currentPage - 1}`}>
                          <ChevronLeft className="h-3.5 w-3.5" /> Previous
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 text-xs font-medium gap-1 opacity-50 rounded-lg"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Previous
                      </Button>
                    )}

                    {currentPage < totalPages ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-medium gap-1 rounded-lg"
                      >
                        <Link href={`?page=${currentPage + 1}`}>
                          Next <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 text-xs font-medium gap-1 opacity-50 rounded-lg"
                      >
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}