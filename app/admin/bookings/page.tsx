import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import UpdateBookingStatusButton from "@/components/admin/UpdateBookingStatusButton";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Sparkles,
  Calendar,
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Inbox,
  User,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminBookingsPageProps {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const query = resolvedParams.query ?? "";
  const statusFilter = resolvedParams.status ?? "ALL";
  const currentPage = Math.max(1, parseInt(resolvedParams.page ?? "1", 10) || 1);

  // Build dynamic Prisma filters based on search/tab state
  const whereClause: any = {};

  if (statusFilter !== "ALL") {
    whereClause.status = statusFilter;
  }

  if (query) {
    whereClause.OR = [
      { id: { contains: query, mode: "insensitive" } },
      { address: { contains: query, mode: "insensitive" } },
      { customer: { name: { contains: query, mode: "insensitive" } } },
      { customer: { email: { contains: query, mode: "insensitive" } } },
      { service: { name: { contains: query, mode: "insensitive" } } },
      { service: { provider: { user: { name: { contains: query, mode: "insensitive" } } } } },
    ];
  }

  // Calculate skip for offset-based pagination
  const skip = (currentPage - 1) * PAGE_SIZE;

  // Execute database queries in parallel
  const [
    bookings,
    filteredBookingsCount,
    totalBookingsCount,
    pendingCount,
    acceptedCount,
    completedCount,
    cancelledCount,
  ] = await Promise.all([
    prisma.booking.findMany({
      where: whereClause,
      take: PAGE_SIZE,
      skip: skip,
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        service: {
          include: {
            provider: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({ where: whereClause }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "ACCEPTED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: { in: ["CANCELLED", "REJECTED"] } } }),
  ]);

  const totalPages = Math.ceil(filteredBookingsCount / PAGE_SIZE) || 1;

  // Helper to construct query strings for pagination links while preserving filters
  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (query) params.set("query", query);
    params.set("page", pageNumber.toString());
    return `/admin/bookings?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Booking Management
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-600">
                {totalBookingsCount} Total Records
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Manage Bookings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Filter, search, and perform actions across all customer service appointments.
            </p>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending
                </p>
                <p className="text-2xl font-extrabold text-amber-600">{pendingCount}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 border border-amber-100">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  In Progress
                </p>
                <p className="text-2xl font-extrabold text-blue-600">{acceptedCount}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Completed
                </p>
                <p className="text-2xl font-extrabold text-emerald-600">{completedCount}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Cancelled
                </p>
                <p className="text-2xl font-extrabold text-slate-600">{cancelledCount}</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600 border border-slate-200">
                <XCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Table Container */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100/80 p-1.5 border border-slate-200/50">
                {[
                  { label: "All Bookings", val: "ALL" },
                  { label: "Pending", val: "PENDING" },
                  { label: "Accepted", val: "ACCEPTED" },
                  { label: "Completed", val: "COMPLETED" },
                  { label: "Cancelled", val: "CANCELLED" },
                ].map((tab) => (
                  <a
                    key={tab.val}
                    href={`/admin/bookings?status=${tab.val}${query ? `&query=${encodeURIComponent(query)}` : ""}`}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      statusFilter === tab.val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </a>
                ))}
              </div>

              {/* Search Box */}
              <form method="GET" action="/admin/bookings" className="relative flex-1 md:max-w-xs">
                <input type="hidden" name="status" value={statusFilter} />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  name="query"
                  defaultValue={query}
                  placeholder="Search customer, provider, service..."
                  className="pl-9 bg-white/90 border-slate-200 text-sm focus-visible:ring-indigo-500"
                />
              </form>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                  <Inbox className="h-8 w-8" />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  No bookings found
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Try clearing your search query or switching status filters.
                </p>
              </div>
            ) : (
              <>
                {/* Dedicated Horizontal Scroll Region with Explicit Minimum Width */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/80 border-y border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-3.5">Service & Price</th>
                        <th className="px-6 py-3.5">Customer</th>
                        <th className="px-6 py-3.5">Provider</th>
                        <th className="px-6 py-3.5">Date & Address</th>
                        <th className="px-6 py-3.5">Payment</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="transition-colors hover:bg-slate-50/60"
                        >
                          {/* Service */}
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">
                              {booking.service.name}
                            </div>
                            <div className="text-xs font-extrabold text-indigo-600">
                              Rs. {booking.service.price.toLocaleString()}
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 font-medium text-slate-900">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              {booking.customer.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {booking.customer.email}
                            </div>
                          </td>

                          {/* Provider */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 font-medium text-slate-900">
                              <Wrench className="h-3.5 w-3.5 text-slate-400" />
                              {booking.service.provider.user.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {booking.service.provider.user.email}
                            </div>
                          </td>

                          {/* Date & Address */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 max-w-[180px] truncate">
                              <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                              <span className="truncate">{booking.address}</span>
                            </div>
                          </td>

                          {/* Payment */}
                          <td className="px-6 py-4">
                            {booking.payment ? (
                              <Badge
                                variant="outline"
                                className={
                                  booking.payment.status === "SUCCESS"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                }
                              >
                                {booking.payment.status}
                              </Badge>
                            ) : (
                              <span className="text-xs font-medium text-slate-400">
                                Unpaid
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                booking.status === "COMPLETED"
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : booking.status === "ACCEPTED"
                                  ? "border border-blue-200 bg-blue-50 text-blue-700"
                                  : booking.status === "CANCELLED" || booking.status === "REJECTED"
                                  ? "border border-slate-200 bg-slate-100 text-slate-700"
                                  : "border border-amber-200 bg-amber-50 text-amber-700"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="inline-block text-left">
                              <UpdateBookingStatusButton
                                bookingId={booking.id}
                                status={booking.status}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Toolbar */}
                <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-900">
                      {skip + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-slate-900">
                      {Math.min(skip + PAGE_SIZE, filteredBookingsCount)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {filteredBookingsCount}
                    </span>{" "}
                    results
                  </p>

                  <div className="flex items-center gap-2">
                    {currentPage > 1 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        
                        className="h-8 border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Link href={buildPageUrl(currentPage - 1)}>
                          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                          Previous
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 border-slate-200 text-xs font-semibold text-slate-400"
                      >
                        <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                        Previous
                      </Button>
                    )}

                    <span className="px-2 text-xs font-medium text-slate-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    {currentPage < totalPages ? (
                      <Button
                        variant="outline"
                        size="sm"
                        
                        className="h-8 border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Link href={buildPageUrl(currentPage + 1)}>
                          Next
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 border-slate-200 text-xs font-semibold text-slate-400"
                      >
                        Next
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}