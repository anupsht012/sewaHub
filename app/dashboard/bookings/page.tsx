import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import ReviewModal from "@/components/shared/ReviewModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Inbox,
  User,
  Eye,
  Tag,
  Receipt,
  ArrowRight,
} from "lucide-react";

export default async function CustomerBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CUSTOMER") {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: user.id,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          provider: {
            select: {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  // Helper function for dynamic status badge rendering
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-50 text-amber-700 border-amber-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <Clock className="h-3.5 w-3.5" /> PENDING
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> ACCEPTED
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <Sparkles className="h-3.5 w-3.5" /> COMPLETED
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-rose-50 text-rose-700 border-rose-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <XCircle className="h-3.5 w-3.5" /> {status}
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
              className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs"
            >
              <Receipt className="h-3 w-3 mr-1" /> Service Log
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Track your service bookings, manage appointments, and leave feedback.
          </p>
        </div>

        {/* Content */}
        {bookings.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
              <Inbox className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              No bookings found
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              You haven't booked any services yet. When you schedule a service, it will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <Table>
                <TableHeader className="bg-slate-50/70">
                  <TableRow className="border-b border-slate-200/80 hover:bg-slate-50/70">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                      Service
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                      Provider
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                      Price
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right py-4">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-sm">
                            {booking.service.name}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <Tag className="h-3 w-3" />
                            <span>ID: {booking.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span>
                            {booking.service.provider.user.name || "Provider"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 font-bold text-xs text-slate-900">
                        NPR {booking.service.price.toLocaleString("ne-NP")}
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {new Date(booking.bookingDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        {getStatusBadge(booking.status)}
                      </TableCell>

                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/bookings/${booking.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1 text-slate-400" />
                              View
                            </Button>
                          </Link>

                          {booking.status === "COMPLETED" && (
                            <ReviewModal serviceId={booking.service.id} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile / Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {bookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
                >
                  <CardContent className="p-0 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900">
                          {booking.service.name}
                        </h2>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Booking ID: {booking.id.slice(0, 8)}
                        </p>
                      </div>
                      <div>{getStatusBadge(booking.status)}</div>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {booking.service.provider.user.name || "Provider"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          {new Date(booking.bookingDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Total Price
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          NPR {booking.service.price.toLocaleString("ne-NP")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/bookings/${booking.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            View Details
                            <ArrowRight className="h-3 w-3 ml-1 text-slate-400" />
                          </Button>
                        </Link>

                        {booking.status === "COMPLETED" && (
                          <ReviewModal serviceId={booking.service.id} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}