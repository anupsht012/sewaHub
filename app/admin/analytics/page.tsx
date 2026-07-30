import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import {
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  MapPin,
  Star,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all analytics data directly based on your Prisma models
  const [
    totalUsers,
    totalProviders,
    totalServices,
    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    acceptedBookings,
    successfulPayments,
    recentPayments,
    categoryGroups,
    topProviders,
    locationStats,
    recentReviews,
  ] = await Promise.all([
    // Core Counts
    prisma.user.count(),
    prisma.provider.count(),
    prisma.service.count(),
    prisma.booking.count(),

    // Booking Status Breakdowns
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({
      where: { status: { in: ["CANCELLED", "REJECTED"] } },
    }),
    prisma.booking.count({ where: { status: "ACCEPTED" } }),

    // Revenue Calculation (Only Successful Payments)
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),

    // Recent Successful Transactions
    prisma.payment.findMany({
      where: { status: "SUCCESS" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            service: true,
          },
        },
        customer: {
          select: { name: true, email: true },
        },
        provider: {
          select: { name: true },
        },
      },
    }),

    // Top Categories from Service model
    prisma.service.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
      take: 5,
    }),

    // Active Providers with Service & Review Counts
    prisma.provider.findMany({
      take: 5,
      orderBy: {
        services: {
          _count: "desc",
        },
      },
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
        _count: {
          select: { services: true, offers: true },
        },
      },
    }),

    // Spatial Distribution by District from Location model
    prisma.location.groupBy({
      by: ["district"],
      _count: {
        district: true,
      },
      orderBy: {
        _count: {
          district: "desc",
        },
      },
      take: 5,
    }),

    // Recent Customer Reviews
    prisma.review.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { name: true },
        },
        service: {
          select: { name: true },
        },
      },
    }),
  ]);

  const totalRevenue = successfulPayments._sum.amount || 0;
  const completionRate =
    totalBookings > 0
      ? Math.round((completedBookings / totalBookings) * 100)
      : 0;

  return (
    <div className="min-h-screen space-y-8 bg-gray-50/50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Platform Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time insights across users, provider activity, bookings, and payments.
          </p>
        </div>
      </div>

      <Separator />

      {/* Top Level Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Revenue
            </CardTitle>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {totalRevenue.toLocaleString()}
            </div>
            <p className="mt-1 flex items-center text-xs font-medium text-emerald-600">
              <TrendingUp className="mr-1 h-3.5 w-3.5" /> Successful completed payments
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Bookings
            </CardTitle>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalBookings}
            </div>
            <p className="mt-1 text-xs font-medium text-blue-600">
              {completionRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Registered Users
            </CardTitle>
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalUsers}
            </div>
            <p className="mt-1 text-xs font-medium text-violet-600">
              {totalProviders} active service providers
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Listed Services
            </CardTitle>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalServices}
            </div>
            <p className="mt-1 text-xs font-medium text-amber-600">
              Across {categoryGroups.length} primary categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Lifecycle Summary */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Booking Status Breakdown
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-emerald-600">
                {completedBookings}
              </div>
              <p className="mt-1 text-xs text-gray-400">Fulfilled orders</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                In Progress
              </CardTitle>
              <Clock className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-600">
                {acceptedBookings}
              </div>
              <p className="mt-1 text-xs text-gray-400">Accepted by provider</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Pending Approval
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-amber-600">
                {pendingBookings}
              </div>
              <p className="mt-1 text-xs text-gray-400">Awaiting acceptance</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Cancelled / Rejected
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-red-600">
                {cancelledBookings}
              </div>
              <p className="mt-1 text-xs text-gray-400">Unfulfilled requests</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid: Financials & Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Financial Transactions */}
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Verified eSewa, Khalti, and cash settlements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No verified transactions recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3.5"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {p.booking?.service?.name || "Service Payment"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Paid by {p.customer?.name || "Customer"} via{" "}
                        <span className="font-semibold text-gray-700">
                          {p.method}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        +Rs. {p.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Popular Service Categories
            </CardTitle>
            <CardDescription>
              Categories with the largest number of registered offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryGroups.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No active categories found.
              </p>
            ) : (
              <div className="space-y-3">
                {categoryGroups.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-3.5"
                  >
                    <span className="text-sm font-medium capitalize text-gray-800">
                      {cat.category}
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {cat._count.category}{" "}
                      {cat._count.category === 1 ? "Service" : "Services"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid: Providers, Locations, & Feedback */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Providers */}
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Top Service Providers
            </CardTitle>
            <CardDescription>
              Providers managing active service listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProviders.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No active providers.
              </p>
            ) : (
              <div className="space-y-3">
                {topProviders.map((prov) => (
                  <div
                    key={prov.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {prov.user.name}
                      </p>
                      <p className="text-xs text-gray-500">{prov.location}</p>
                    </div>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {prov._count.services} Services
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* District Coverage */}
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Geographic Coverage
            </CardTitle>
            <CardDescription>Top active districts by location</CardDescription>
          </CardHeader>
          <CardContent>
            {locationStats.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No location data registered.
              </p>
            ) : (
              <div className="space-y-3">
                {locationStats.map((loc) => (
                  <div
                    key={loc.district}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium text-gray-800">
                        {loc.district}
                      </span>
                    </div>
                    <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                      {loc._count.district} Entries
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card className="rounded-2xl border-gray-100 bg-white shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Recent Reviews
            </CardTitle>
            <CardDescription>
              Latest customer service ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No customer reviews submitted yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-800">
                        {rev.customer.name}
                      </p>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span className="ml-1 text-xs font-bold">
                          {rev.rating}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Service: {rev.service.name}
                    </p>
                    {rev.comment && (
                      <p className="mt-1 text-xs italic text-gray-600">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}