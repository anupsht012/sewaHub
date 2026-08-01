import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Filter,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const query = resolvedParams.query || "";
  const status = resolvedParams.status || "ALL";
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));

  // Build filter conditions
  const whereCondition: any = {};

  if (status && status !== "ALL") {
    whereCondition.status = status;
  }

  if (query) {
    whereCondition.OR = [
      { id: { contains: query, mode: "insensitive" } },
      { transactionUuid: { contains: query, mode: "insensitive" } },
      { method: { contains: query, mode: "insensitive" } },
      {
        booking: {
          customer: {
            name: { contains: query, mode: "insensitive" },
          },
        },
      },
      {
        booking: {
          customer: {
            email: { contains: query, mode: "insensitive" },
          },
        },
      },
    ];
  }

  // Fetch payment records and aggregates concurrently
  const [
    payments,
    totalCount,
    totalRevenue,
    successCount,
    pendingCount,
    failedCount,
  ] = await Promise.all([
    prisma.payment.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        booking: {
          include: {
            customer: {
              select: { name: true, email: true },
            },
            service: {
              select: {
                name: true,
                category: true,
                provider: {
                  select: {
                    user: {
                      select: { name: true, email: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where: whereCondition }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),
    prisma.payment.count({ where: { status: "SUCCESS" } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({
      where: { status: { in: ["FAILED", "REFUNDED"] } },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const revenueAmount = totalRevenue._sum.amount || 0;

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case "SUCCESS":
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Success
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
            <Clock className="mr-1 h-3.5 w-3.5" /> Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors">
            <XCircle className="mr-1 h-3.5 w-3.5" /> Failed
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors">
            <AlertCircle className="mr-1 h-3.5 w-3.5" /> Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{statusStr}</Badge>;
    }
  };

  const createPaginationUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (status && status !== "ALL") params.set("status", status);
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
                Financial Management
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-600">
                {totalCount} Total Transactions
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Payment Transactions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor platform transactions, gateway settlements, and payouts for KaamSewa.
            </p>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Settled Revenue
              </CardTitle>
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                Rs. {revenueAmount.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Gross processed volume</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Successful Payments
              </CardTitle>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {successCount}
              </div>
              <p className="mt-1 text-xs font-medium text-blue-600">
                Completed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending Transactions
              </CardTitle>
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {pendingCount}
              </div>
              <p className="mt-1 text-xs font-medium text-amber-600">
                Awaiting gateway confirmation
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Failed / Refunded
              </CardTitle>
              <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                <XCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {failedCount}
              </div>
              <p className="mt-1 text-xs font-medium text-rose-600">
                Cancelled or failed orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Transaction History
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Showing {payments.length} of {totalCount} recorded payments
                </p>
              </div>

              {/* Filter controls */}
              <form method="GET" className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="query"
                    defaultValue={query}
                    placeholder="Search customer, ID, method..."
                    className="rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select
                  name="status"
                  defaultValue={status}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </button>
              </form>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Transaction Info</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-sm text-slate-500"
                      >
                        No payment transactions found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => {
                      const customer = p.booking?.customer;
                      const service = p.booking?.service;

                      return (
                        <tr
                          key={p.id}
                          className="transition-colors hover:bg-slate-50/50"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-slate-400" />
                              <div>
                                <p className="font-mono text-xs font-semibold text-slate-900">
                                  {p.transactionUuid || p.id.slice(0, 12)}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  ID: {p.id.slice(-8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-slate-900">
                              {customer?.name || "N/A"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {customer?.email || ""}
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-slate-900">
                              {service?.name || "Direct Payment"}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">
                              {service?.category || "General"}
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-700">
                              {p.method}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-slate-900">
                              Rs. {p.amount.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            {getStatusBadge(p.status)}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-500">
                            {new Date(p.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}