import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  Banknote,
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
import MarkCashPaidButton from "@/components/provider/mark-cash-paid-button";
import { PaymentStatus } from "@/lib/generated/prisma";

interface ProviderPaymentsPageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
  }>;
}

export default async function ProviderPaymentsPage({
  searchParams,
}: ProviderPaymentsPageProps) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "PROVIDER" && user.role !== "ADMIN")) {
    redirect("/login");
  }

  // Fetch the provider record corresponding to the current user
  const provider = await prisma.provider.findUnique({
    where: { userId: user.id },
  });

  if (!provider) {
    return (
      <div className="p-10 text-center font-medium text-gray-500">
        Provider profile not found.
      </div>
    );
  }

  const { query, status } = await searchParams;

  // Base filter: Only fetch payments for services owned by this provider
  const whereCondition: any = {
    booking: {
      service: {
        providerId: provider.id,
      },
    },
  };

  if (status && status !== "ALL") {
    whereCondition.status = status as PaymentStatus;
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
          service: {
            name: { contains: query, mode: "insensitive" },
          },
        },
      },
    ];
  }

  // Fetch payments and aggregated provider totals
  const [payments, totalEarned, pendingCod, completedCount] = await Promise.all([
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
              select: { name: true, category: true, price: true },
            },
          },
        },
      },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        booking: { service: { providerId: provider.id } },
        status: PaymentStatus.SUCCESS,
      },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        booking: { service: { providerId: provider.id } },
        method: "CASH",
        status: PaymentStatus.PENDING,
      },
    }),
    prisma.payment.count({
      where: {
        booking: { service: { providerId: provider.id } },
        status: PaymentStatus.SUCCESS,
      },
    }),
  ]);

  const earnedAmount = totalEarned._sum?.amount ?? 0;
  const pendingCodAmount = pendingCod._sum?.amount ?? 0;

  const getStatusBadge = (paymentStatus: string, method: string) => {
    switch (paymentStatus) {
      case PaymentStatus.SUCCESS:
        return (
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Received
          </Badge>
        );
      case PaymentStatus.PENDING:
        if (method === "CASH") {
          return (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
              <Banknote className="mr-1 h-3 w-3" /> Cash to Collect
            </Badge>
          );
        }
        return (
          <Badge className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100">
            <Clock className="mr-1 h-3 w-3" /> Awaiting Gateway
          </Badge>
        );
      case PaymentStatus.FAILED:
        return <Badge variant="destructive">Failed</Badge>;
      case PaymentStatus.REFUNDED:
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>;
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-gray-50/50 p-6 md:p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Earnings & Payments
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track customer payments, digital payouts, and manage Cash on Delivery collections.
        </p>
      </div>

      <Separator />

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Earned
            </CardTitle>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {earnedAmount.toLocaleString()}
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-600">
              Settled from {completedCount} completed bookings
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Pending Cash Collection
            </CardTitle>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Banknote className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {pendingCodAmount.toLocaleString()}
            </div>
            <p className="mt-1 text-xs font-medium text-amber-600">
              Cash to be collected upon service completion
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Transactions
            </CardTitle>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {payments.length}
            </div>
            <p className="mt-1 text-xs font-medium text-blue-600">
              Recorded payments for your services
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
                Payment History
              </CardTitle>
              <p className="text-xs text-gray-500">
                Detailed record of payments for your offered services
              </p>
            </div>

            {/* Search and Filters */}
            <form method="GET" className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="query"
                  defaultValue={query || ""}
                  placeholder="Search customer, service..."
                  className="rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs font-medium text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                name="status"
                defaultValue={status || "ALL"}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value={PaymentStatus.SUCCESS}>Success</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
                <option value={PaymentStatus.REFUNDED}>Refunded</option>
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
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-sm text-gray-500"
                    >
                      No payments found for your services.
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
                          <p className="font-medium text-gray-900">
                            {service?.name || "Service Item"}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {service?.category || "General"}
                          </p>
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
                          {getStatusBadge(p.status, p.method)}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-500">
                          {new Date(p.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {p.method === "CASH" && p.status === PaymentStatus.PENDING ? (
                            <MarkCashPaidButton paymentId={p.id} />
                          ) : (
                            <span className="text-xs text-gray-400">
                              No action
                            </span>
                          )}
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