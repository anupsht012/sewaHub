import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Banknote,
  CheckCircle2,
  Clock,
  Star,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Receipt,
  Lightbulb,
} from "lucide-react";

export default async function ProviderAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "PROVIDER") {
    redirect("/login");
  }

  // 1. Fetch provider profile using the current User ID
  const provider = await prisma.provider.findUnique({
    where: { userId: user.id },
  });

  if (!provider) {
    redirect("/dashboard");
  }

  // 2. Fetch provider aggregated stats with proper relation paths
  const [payments, bookingStats, reviews] = await Promise.all([
    prisma.payment.findMany({
      where: {
        status: "SUCCESS",
        booking: {
          service: {
            providerId: provider.id,
          },
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where: {
        service: {
          providerId: provider.id,
        },
      },
      _count: true,
    }),
    prisma.review.aggregate({
      where: {
        service: {
          providerId: provider.id,
        },
      },
      _avg: { rating: true },
      _count: true,
    }),
  ]);

  const totalEarnings = payments.reduce((acc, curr) => acc + curr.amount, 0);

  const completedCount =
    bookingStats.find((s) => s.status === "COMPLETED")?._count || 0;
  const pendingCount =
    bookingStats.find((s) => s.status === "PENDING")?._count || 0;
  const totalBookings = bookingStats.reduce((acc, s) => acc + s._count, 0);

  const avgRating = reviews._avg.rating
    ? reviews._avg.rating.toFixed(1)
    : "N/A";
  const totalReviews = reviews._count;

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
              <BarChart3 className="h-3 w-3 mr-1" /> Business Insights
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Earnings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Track your revenue, booking volume, and client satisfaction ratings.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {/* Total Earnings */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Earnings
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Banknote className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                NPR {totalEarnings.toLocaleString("ne-NP")}
              </h2>
              <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                <span>Payouts ready</span>
              </div>
            </div>
          </Card>

          {/* Completed Bookings */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Completed Services
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                {completedCount}
              </h2>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Out of {totalBookings} total bookings
              </p>
            </div>
          </Card>

          {/* Pending Requests */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending Requests
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                {pendingCount}
              </h2>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Awaiting your response
              </p>
            </div>
          </Card>

          {/* Rating */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Average Rating
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-100">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                {avgRating}
              </h2>
              <span className="text-xs font-medium text-slate-500">
                ({totalReviews} reviews)
              </span>
            </div>
          </Card>
        </div>

        {/* Breakdowns & Recent Activity Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Transactions List */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs lg:col-span-2">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  Recent Payouts
                </CardTitle>
                <p className="mt-0.5 text-xs text-slate-500">
                  Verified customer transfers directly credited to your account
                </p>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    No Payouts Yet
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Successful payment records will appear here automatically.
                  </p>
                </div>
              ) : (
                payments.slice(0, 5).map((pay, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Banknote className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          Payment Received
                        </p>
                        <p className="text-[11px] font-medium text-slate-400">
                          {new Date(pay.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
                      +NPR {pay.amount.toLocaleString("ne-NP")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Platform Guidelines Box */}
          <Card className="rounded-2xl border border-slate-900 bg-slate-900 p-6 text-white shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                Boost Your Earnings
              </h3>
            </div>
            <ul className="space-y-4 text-xs leading-relaxed text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">
                  ✓
                </span>
                <span>
                  <strong className="text-white font-semibold">Fast Responses:</strong> Maintain an initial response time under 15 minutes to increase booking conversion.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">
                  ✓
                </span>
                <span>
                  <strong className="text-white font-semibold">Keep Schedules Updated:</strong> Maintain accurate availability settings on your profile to minimize cancellations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">
                  ✓
                </span>
                <span>
                  <strong className="text-white font-semibold">Collect Reviews:</strong> Encourage satisfied customers to leave 5-star ratings to rank higher in search results.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}