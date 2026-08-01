import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import CompleteBookingButton from "@/components/provider/CompleteBookingButton";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  CalendarCheck,
  User,
  CreditCard,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProviderBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "PROVIDER") {
    redirect("/");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mx-auto mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Provider Profile Not Found
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Please setup your provider account to view your bookings.
          </p>
        </Card>
      </div>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: {
      service: {
        providerId: provider.id,
      },
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      service: {
        select: {
          name: true,
          price: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-semibold text-xs gap-1 px-2.5 py-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-semibold text-xs gap-1 px-2.5 py-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-semibold text-xs gap-1 px-2.5 py-0.5">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold text-xs gap-1 px-2.5 py-0.5">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-semibold text-xs gap-1 px-2.5 py-0.5">
            <Clock className="h-3.5 w-3.5" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs">
              <Sparkles className="h-3 w-3 mr-1" /> Booking Management
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage customer service bookings and update completion status.
          </p>
        </div>

        {/* BOOKINGS TABLE CONTAINER */}
        {bookings.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
              <CalendarCheck className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No Bookings Yet</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Customer bookings for your services will appear here once requested.
            </p>
          </Card>
        ) : (
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" /> Customer Bookings History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="font-semibold text-slate-700 text-xs">Service</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Customer</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Price</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Date</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Phone</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Address</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Note</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Payment</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Status</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => {
                      const isPaid = booking.payment?.status === "SUCCESS";

                      return (
                        <TableRow key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <TableCell className="font-bold text-slate-900 text-xs sm:text-sm">
                            {booking.service.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8 border border-slate-200 shrink-0">
                                <AvatarImage src={booking.customer.image || ""} />
                                <AvatarFallback className="bg-slate-200 text-slate-700 text-xs font-bold">
                                  {booking.customer.name?.charAt(0).toUpperCase() || <User className="h-3.5 w-3.5" />}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-slate-900 text-xs">{booking.customer.name}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{booking.customer.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-extrabold text-blue-600 text-xs sm:text-sm">
                            Rs. {booking.service.price}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {booking.phone}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate text-xs text-slate-600 font-medium">
                            <div className="flex items-center gap-1 truncate" title={booking.address}>
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate">{booking.address}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate text-xs text-slate-500 italic">
                            <div className="flex items-center gap-1 truncate" title={booking.note || "None"}>
                              <FileText className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate">{booking.note || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {isPaid ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px] font-bold gap-1">
                                <CreditCard className="h-3 w-3 text-emerald-600" /> Paid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">
                                Unpaid
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            {booking.status === "ACCEPTED" && (
                              <CompleteBookingButton
                                bookingId={booking.id}
                                canComplete={isPaid}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}