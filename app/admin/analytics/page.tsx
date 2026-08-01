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
  Activity,
  CreditCard,
  Layers,
  Sparkles,
  BarChart3,
  Building2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      where: {
        status: "SUCCESS",
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        booking: {
          include: {
            service: {
              include: {
                provider: {
                  include: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Admin Analytics
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-600">
                Live Data
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Platform Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview of revenue, active providers, services, and operational health.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Revenue
              </CardTitle>
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                Rs. {totalRevenue.toLocaleString()}
              </div>
              <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
                <TrendingUp className="mr-1 h-3.5 w-3.5" /> Settled Payments
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Bookings
              </CardTitle>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                {totalBookings}
              </div>
              <div className="mt-2 flex items-center text-xs font-medium text-blue-600">
                <Activity className="mr-1 h-3.5 w-3.5" /> {completionRate}% Completion Rate
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Registered Users
              </CardTitle>
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                {totalUsers}
              </div>
              <div className="mt-2 flex items-center text-xs font-medium text-violet-600">
                <Building2 className="mr-1 h-3.5 w-3.5" /> {totalProviders} Service Providers
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Offerings
              </CardTitle>
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Briefcase className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                {totalServices}
              </div>
              <div className="mt-2 flex items-center text-xs font-medium text-amber-600">
                <BarChart3 className="mr-1 h-3.5 w-3.5" /> {categoryGroups.length} Categories
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Lifecycle Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Booking Performance Lifecycle
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Card className="border-emerald-100 bg-emerald-50/30 shadow-sm transition-all hover:shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  Completed
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-emerald-600">
                  {completedBookings}
                </div>
                <p className="mt-1 text-xs text-slate-500">Fulfilled bookings</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-blue-50/30 shadow-sm transition-all hover:shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  In Progress
                </CardTitle>
                <Clock className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-600">
                  {acceptedBookings}
                </div>
                <p className="mt-1 text-xs text-slate-500">Accepted by provider</p>
              </CardContent>
            </Card>

            <Card className="border-amber-100 bg-amber-50/30 shadow-sm transition-all hover:shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  Pending Approval
                </CardTitle>
                <Clock className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-amber-600">
                  {pendingBookings}
                </div>
                <p className="mt-1 text-xs text-slate-500">Awaiting provider review</p>
              </CardContent>
            </Card>

            <Card className="border-rose-100 bg-rose-50/30 shadow-sm transition-all hover:shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  Cancelled / Rejected
                </CardTitle>
                <XCircle className="h-5 w-5 text-rose-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-rose-600">
                  {cancelledBookings}
                </div>
                <p className="mt-1 text-xs text-slate-500">Unfulfilled requests</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Grid: Financial Transactions & Top Categories */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Financial Transactions */}
          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Verified platform payments
                </CardDescription>
              </div>
              <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No verified transactions recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentPayments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-100/60"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">
                          {p.booking.service.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Paid by {p.user?.name ?? "Customer"} via{" "}
                          <span className="font-semibold text-slate-700 uppercase">
                            {p.method}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-emerald-600">
                          +Rs. {p.amount.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Service Categories */}
          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Popular Categories
                </CardTitle>
                <CardDescription>
                  Top categories by service volume
                </CardDescription>
              </div>
              <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                <Layers className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {categoryGroups.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No active categories found.
                </p>
              ) : (
                <div className="space-y-3">
                  {categoryGroups.map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-100/60"
                    >
                      <span className="text-sm font-semibold capitalize text-slate-800">
                        {cat.category}
                      </span>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200/60 font-bold px-2.5 py-1 text-xs">
                        {cat._count.category}{" "}
                        {cat._count.category === 1 ? "Service" : "Services"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Grid: Providers, Locations, & Reviews */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Providers */}
          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-md lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Top Providers
              </CardTitle>
              <CardDescription>
                Most active service providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topProviders.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No active providers.
                </p>
              ) : (
                <div className="space-y-3">
                  {topProviders.map((prov) => (
                    <div
                      key={prov.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:bg-slate-100/60"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {prov.user.name}
                        </p>
                        <p className="text-xs text-slate-500">{prov.location}</p>
                      </div>
                      <Badge className="bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200/60 font-bold text-xs">
                        {prov._count.services} Services
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* District Coverage */}
          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-md lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Geographic Coverage
              </CardTitle>
              <CardDescription>Active service districts</CardDescription>
            </CardHeader>
            <CardContent>
              {locationStats.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No location data.
                </p>
              ) : (
                <div className="space-y-3">
                  {locationStats.map((loc) => (
                    <div
                      key={loc.district}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:bg-slate-100/60"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-rose-500" />
                        <span className="text-sm font-medium text-slate-800">
                          {loc.district}
                        </span>
                      </div>
                      <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200/60 font-bold text-xs">
                        {loc._count.district} Entries
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Reviews */}
          <Card className="border-slate-100 bg-white/80 backdrop-blur-sm shadow-md lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Recent Feedback
              </CardTitle>
              <CardDescription>Latest customer ratings</CardDescription>
            </CardHeader>
            <CardContent>
              {recentReviews.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No customer reviews yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-100/60"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800">
                          {rev.customer.name}
                        </p>
                        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200/60">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {rev.rating}
                        </div>
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {rev.service.name}
                      </p>
                      {rev.comment && (
                        <p className="mt-1.5 rounded-lg border border-slate-100 bg-white p-2 text-xs italic text-slate-600">
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
    </div>
  );
}