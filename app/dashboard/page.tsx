import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
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
import {
  Calendar,
  FileText,
  Star,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: user.id,
    },
    include: {
      service: {
        include: {
          provider: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  const requests = await prisma.serviceRequest.findMany({
    where: {
      customerId: user.id,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      customerId: user.id,
    },
  });

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-semibold text-xs gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "ACCEPTED":
      case "CONFIRMED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-semibold text-xs gap-1">
            <CheckCircle2 className="h-3 w-3" /> Accepted
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-semibold text-xs gap-1">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </Badge>
        );
      case "REJECTED":
      case "CANCELLED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-semibold text-xs gap-1">
            <XCircle className="h-3 w-3" /> {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-600 font-semibold text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Customer Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your active bookings, service requests, and feedback.
          </p>
        </div>

        <Link href="/services">
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all cursor-pointer">
            <PlusCircle className="h-4 w-4" /> Book New Service
          </button>
        </Link>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Bookings Stat */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Bookings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900">{bookings.length}</h2>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Recent service reservations</p>
          </div>
        </Card>

        {/* Requests Stat */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Service Requests
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900">{requests.length}</h2>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Posted custom requests</p>
          </div>
        </Card>

        {/* Reviews Stat */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reviews Given
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900">{reviewCount}</h2>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Provider ratings & comments</p>
          </div>
        </Card>

        {/* Action CTA Card */}
        <Link
          href="/services"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Explore Market
            </span>
            <ArrowRight className="h-5 w-5 text-blue-400 transition-transform group-hover:translate-x-1" />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-300">Need another service?</p>
            <h2 className="text-xl font-bold text-white mt-0.5">Find Services &rarr;</h2>
          </div>
        </Link>
      </div>

      {/* RECENT REQUESTS TABLE */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Recent Requests
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Custom requirements submitted to local professionals
            </p>
          </div>

          <Link
            href="/dashboard/requests"
            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline gap-1"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/50">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No requests submitted yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Post custom service requests to get offers from nearby providers.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5">Title</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5">Location</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-800 text-xs sm:text-sm py-4">
                        {request.title}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs sm:text-sm py-4">
                        {request.location}
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(request.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RECENT BOOKINGS TABLE */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Recent Bookings
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct bookings made with marketplace providers
            </p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline gap-1"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/50">
              <Calendar className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No active bookings found</p>
              <p className="text-xs text-slate-400 mt-1">
                Browse our services directory to hire top verified professionals.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5">Service</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5">Provider</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5">Price</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-800 text-xs sm:text-sm py-4">
                        {booking.service.name}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs sm:text-sm font-medium py-4">
                        {booking.service.provider.user.name}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 text-xs sm:text-sm py-4">
                        Rs. {booking.service.price}
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Link
                          href={`/dashboard/bookings/${booking.id}`}
                          className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline gap-0.5"
                        >
                          Details <ChevronRight className="h-3 w-3" />
                        </Link>
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
  );
}