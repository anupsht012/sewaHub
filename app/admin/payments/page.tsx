import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
  }>;
}

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const { query, status } = await searchParams;

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

  // Fetch payment records and aggregates
  const [payments, totalRevenue, successCount, pendingCount, failedCount] =
    await Promise.all([
      prisma.payment.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
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

  const revenueAmount = totalRevenue._sum.amount || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Success
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200">
            <XCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-gray-50/50 p-6 md:p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Payment Transactions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor platform transactions, gateway settlements, and payouts.
        </p>
      </div>

      <Separator />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Settled Revenue
            </CardTitle>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {revenueAmount.toLocaleString()}
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-600">
              Gross processed volume
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Successful Payments
            </CardTitle>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {successCount}
            </div>
            <p className="mt-1 text-xs font-medium text-blue-600">
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Pending Transactions
            </CardTitle>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {pendingCount}
            </div>
            <p className="mt-1 text-xs font-medium text-amber-600">
              Awaiting gateway confirmation
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Failed / Refunded
            </CardTitle>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {failedCount}
            </div>
            <p className="mt-1 text-xs font-medium text-rose-600">
              Cancelled or failed orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table Section */}
      <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Transaction History
              </CardTitle>
              <p className="text-xs text-gray-500">
                Showing all recorded customer payments
              </p>
            </div>

            {/* Filter controls */}
            <form method="GET" className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="query"
                  defaultValue={query || ""}
                  placeholder="Search customer, ID, method..."
                  className="rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs font-medium text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                name="status"
                defaultValue={status || "ALL"}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
              >
                Filter
              </button>
            </form>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
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
              <tbody className="divide-y divide-gray-100">
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-sm text-gray-500"
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
                        className="transition-colors hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-mono text-xs font-semibold text-gray-900">
                                {p.transactionUuid || p.id.slice(0, 12)}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                ID: {p.id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-900">
                            {customer?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {customer?.email || ""}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-900">
                            {service?.name || "Direct Payment"}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {service?.category || "General"}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase text-gray-700">
                            {p.method}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-gray-900">
                            Rs. {p.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-500">
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
        </CardContent>
      </Card>
    </div>
  );
}