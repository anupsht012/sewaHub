import { prisma } from "@/lib/prisma";
import {
  Users,
  UserCheck,
  Wrench,
  CalendarCheck,
  Star,
  Mail,
  Clock,
  CheckCircle2,
  Sparkles,
  XCircle,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [
    users,
    providers,
    services,
    bookings,
    reviews,
    messages,
    recentBookings,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.provider.count(),

    prisma.service.count(),

    prisma.booking.count(),

    prisma.review.count(),

    prisma.contactMessage.count(),

    prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        service: true,
      },
    }),

    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const cards = [
    {
      title: "Total Users",
      value: users,
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Providers",
      value: providers,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Active Services",
      value: services,
      icon: Wrench,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Total Bookings",
      value: bookings,
      icon: CalendarCheck,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Reviews",
      value: reviews,
      icon: Star,
      color: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      title: "Messages",
      value: messages,
      icon: Mail,
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
  ];

  // Status badge selector for recent bookings
  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-50 text-amber-700 border-amber-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <Clock className="h-3 w-3" /> PENDING
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <CheckCircle2 className="h-3 w-3" /> ACCEPTED
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <Sparkles className="h-3 w-3" /> COMPLETED
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-rose-50 text-rose-700 border-rose-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <XCircle className="h-3 w-3" /> {status}
          </Badge>
        );
    }
  };

  // Role badge selector for new users
  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 border-purple-200/80 font-bold text-xs gap-1 px-2.5 py-0.5"
          >
            <ShieldCheck className="h-3 w-3" /> ADMIN
          </Badge>
        );
      case "PROVIDER":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold text-xs gap-1 px-2.5 py-0.5"
          >
            <UserCheck className="h-3 w-3" /> PROVIDER
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200/80 font-bold text-xs gap-1 px-2.5 py-0.5"
          >
            CUSTOMER
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="rounded-md bg-amber-50 text-amber-700 border-amber-200/80 font-semibold text-xs"
            >
              Control Center 👑
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Overview of platform activity, key metrics, and user signups.
          </p>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {cards?.map((card) => {
            const Icon = card.icon;

            return (
              <Card
                key={card.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500">
                    {card.title}
                  </p>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${card.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {card.value.toLocaleString()}
                  </h2>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5 text-emerald-500" />
                    Live
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 pb-5 flex-row items-center justify-between space-y-0 border-b border-slate-100">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Recent Bookings
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest requests created on the platform
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-4">
              {recentBookings?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No bookings registered yet.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <Table>
                    <TableHeader className="bg-slate-50/70">
                      <TableRow className="border-b border-slate-100 hover:bg-slate-50/70">
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3">
                          Service
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3">
                          Customer
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right py-3">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100">
                      {recentBookings.map((booking: any) => (
                        <TableRow
                          key={booking.id}
                          className="transition-colors hover:bg-slate-50/50"
                        >
                          <TableCell className="py-3 font-semibold text-slate-900 text-xs">
                            {booking.service.name}
                          </TableCell>
                          <TableCell className="py-3 text-xs text-slate-600 font-medium">
                            {booking.customer.name || "Anonymous User"}
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            {getBookingStatusBadge(booking.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Users */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 pb-5 flex-row items-center justify-between space-y-0 border-b border-slate-100">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  New Users
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recently registered platform accounts
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-4">
              {recentUsers?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No users registered yet.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <Table>
                    <TableHeader className="bg-slate-50/70">
                      <TableRow className="border-b border-slate-100 hover:bg-slate-50/70">
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3">
                          User
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3">
                          Email
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right py-3">
                          Role
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100">
                      {recentUsers.map((user: any) => (
                        <TableRow
                          key={user.id}
                          className="transition-colors hover:bg-slate-50/50"
                        >
                          <TableCell className="py-3 font-semibold text-slate-900 text-xs">
                            {user.name || "N/A"}
                          </TableCell>
                          <TableCell className="py-3 text-xs text-slate-500 font-medium">
                            {user.email}
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            {getUserRoleBadge(user.role)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}