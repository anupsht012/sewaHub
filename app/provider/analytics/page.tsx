import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  Star,
  ArrowUpRight,
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Analytics & Earnings
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Track your revenue, booking volume, and client satisfaction ratings.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        {/* Total Earnings */}
        <div className="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600 dark:bg-emerald-500/20">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold sm:text-3xl">
              NPR {totalEarnings.toLocaleString("ne-NP")}
            </h2>
            <div className="mt-1 flex items-center text-xs text-emerald-600">
              <TrendingUp size={14} className="mr-1" />
              <span>Payouts ready</span>
            </div>
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Completed Services
            </span>
            <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600 dark:bg-blue-500/20">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold sm:text-3xl">{completedCount}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Out of {totalBookings} total bookings
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-600 dark:bg-amber-500/20">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold sm:text-3xl">{pendingCount}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Awaiting your response
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Average Rating
            </span>
            <div className="rounded-lg bg-yellow-500/10 p-2.5 text-yellow-600 dark:bg-yellow-500/20">
              <Star size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h2 className="text-2xl font-bold sm:text-3xl">{avgRating}</h2>
            <span className="text-xs text-muted-foreground">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Breakdowns & Recent Activity Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions List */}
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-lg font-semibold">Recent Payouts</h3>
              <p className="text-xs text-muted-foreground">
                Verified customer transfers
              </p>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
              View all <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y">
            {payments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No successful payments recorded yet.
              </p>
            ) : (
              payments.slice(0, 5).map((pay, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pay.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    +NPR {pay.amount.toLocaleString("ne-NP")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Platform Guidelines Box */}
        <div className="rounded-xl border bg-slate-900 p-6 text-white shadow-sm dark:bg-card dark:text-foreground">
          <h3 className="text-lg font-semibold">Boost Your Earnings</h3>
          <ul className="mt-4 space-y-3 text-xs text-slate-300 dark:text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="rounded-full bg-blue-500/20 p-1 text-blue-400">
                ✓
              </span>
              <span>Maintain a fast response time under 15 minutes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="rounded-full bg-blue-500/20 p-1 text-blue-400">
                ✓
              </span>
              <span>Keep accurate availability settings on your profile.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="rounded-full bg-blue-500/20 p-1 text-blue-400">
                ✓
              </span>
              <span>Encourage satisfied customers to leave 5-star reviews.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}