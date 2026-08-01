import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import Link from "next/link";
import CancelBookingButton from "@/components/shared/CancelBookingButton";
import ReviewModal from "@/components/shared/ReviewModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  BadgeCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingDetailsPage({
  params,
}: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      customerId: user.id,
    },
    include: {
      payment: true,
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
  });

  if (!booking) {
    notFound();
  }

  const isPaid = booking.payment?.status === "SUCCESS";

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-semibold text-xs gap-1 px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-semibold text-xs gap-1 px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-semibold text-xs gap-1 px-3 py-1">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold text-xs gap-1 px-3 py-1">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-semibold text-xs gap-1 px-3 py-1">
            <Clock className="h-3.5 w-3.5" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* HEADER NAVIGATION BAR */}
      <div className="border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Bookings
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
        
        {/* HEADER SECTION CARD */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs">
                  <Sparkles className="h-3 w-3 mr-1" /> Booking Details
                </Badge>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
                {booking.service.name}
              </h1>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                {booking.service.description || "No specific description available for this service."}
              </p>
            </div>

            <div className="shrink-0 self-start">
              {getStatusBadge(booking.status)}
            </div>
          </div>
        </Card>

        {/* PAYMENT REQUIRED ALERT BANNER */}
        {booking.status === "ACCEPTED" && !isPaid && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Booking Accepted by Provider!
                </h3>
                <p className="mt-0.5 text-xs text-emerald-800">
                  Please complete your payment to finalize the service request.
                </p>
              </div>
            </div>
            <Link
              href={`/dashboard/bookings/${booking.id}/pay`}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all shrink-0 w-full sm:w-auto text-center"
            >
              Pay Now
            </Link>
          </div>
        )}

        {/* TWO-COLUMN GRID FOR INFORMATION & PROVIDER */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* BOOKING INFORMATION */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <CardHeader className="p-0 mb-4 pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" /> Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Service Price</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  Rs. {booking.service.price}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Date
                </span>
                <span className="font-semibold text-slate-800">
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Contact Phone
                </span>
                <span className="font-semibold text-slate-800">{booking.phone}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> Address
                </span>
                <span className="font-semibold text-slate-800 text-right ml-4">{booking.address}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                  <FileText className="h-3.5 w-3.5 text-slate-400" /> Special Note
                </span>
                <span className="font-medium text-slate-700 text-right ml-4 italic">
                  {booking.note || "No note provided"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" /> Payment Status
                </span>
                {isPaid ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-bold text-[11px]">
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[11px]">
                    Unpaid
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PROVIDER DETAILS */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <CardHeader className="p-0 mb-4 pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" /> Service Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-12 w-12 border border-slate-200 ring-2 ring-slate-50 shrink-0">
                    <AvatarImage src={booking.service.provider.user.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-base">
                      {booking.service.provider.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {booking.service.provider.user.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{booking.service.provider.location || "Nepal"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-2">
                  <div className="flex items-center text-xs text-slate-600 gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Guaranteed quality service</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-600 gap-2">
                    <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Verified contact information</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {booking.service.provider.verified ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                  <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" /> Verified Professional Provider
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" /> Pending Verification
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* ACTIONS BOTTOM FOOTER */}
        {(booking.status === "PENDING" || (booking.status === "ACCEPTED" && !isPaid) || booking.status === "COMPLETED") && (
          <div className="flex items-center justify-end gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            {booking.status === "PENDING" && (
              <CancelBookingButton bookingId={booking.id} />
            )}

            {booking.status === "ACCEPTED" && !isPaid && (
              <Link
                href={`/dashboard/bookings/${booking.id}/pay`}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
              >
                Pay Now
              </Link>
            )}

            {booking.status === "COMPLETED" && (
              <ReviewModal serviceId={booking.service.id} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}