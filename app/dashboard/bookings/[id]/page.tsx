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
  Ban,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailsPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: user.id },
    include: {
      payment: true,
      service: { include: { provider: { include: { user: true } } } },
    },
  });

  if (!booking) notFound();

  const paymentStatus = booking.payment?.status;
  const isPaid = paymentStatus === "SUCCESS";
  const isPending = paymentStatus === "PENDING";
  const isFailed = paymentStatus === "FAILED" ||!booking.payment;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs gap-1 px-3 py-1"><CheckCircle2 className="h-3.5 w-3.5" /> Accepted</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-xs gap-1 px-3 py-1"><CheckCircle2 className="h-3.5 w-3.5" /> Completed</Badge>;
      case "REJECTED":
      case "CANCELLED":
        return <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-semibold text-xs gap-1 px-3 py-1"><XCircle className="h-3.5 w-3.5" /> {status}</Badge>;
      default:
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-semibold text-xs gap-1 px-3 py-1"><Clock className="h-3.5 w-3.5" /> Pending</Badge>;
    }
  };

  const getPaymentBadge = () => {
    if (isPaid) return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-">Paid - Verified</Badge>;
    if (isPending) return <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-"><Clock className="h-3 w-3 mr-1" />Verification Pending</Badge>;
    return <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-bold text-"><XCircle className="h-3 w-3 mr-1" />Unpaid</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <Link href="/dashboard/bookings" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Bookings
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
        <Card className="rounded-2xl border bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 text-xs"><Sparkles className="h-3 w-3 mr-1" /> Booking Details</Badge>
                {getPaymentBadge()}
              </div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">{booking.service.name}</h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">{booking.service.description || "No description."}</p>
            </div>
            <div className="shrink-0">{getStatusBadge(booking.status)}</div>
          </div>
        </Card>

        {/* PAYMENT STATUS BANNERS */}
        {isPending && (
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0"><Clock className="h-5 w-5" /></div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-950">Payment Under Verification</h3>
              <p className="mt-0.5 text-xs text-amber-800">We received Rs. {booking.payment?.amount} via {booking.payment?.method}. Txn: {booking.payment?.transactionUuid?.slice(0, 16)}</p>
              <p className="mt-1 text- text-amber-700">Admin will verify your screenshot within 30 minutes. You cannot pay again until verification is done.</p>
              {booking.payment?.proofImageUrl && <a href={booking.payment.proofImageUrl} target="_blank" className="mt-2 inline-flex text-xs font-bold text-amber-900 underline">View Your Proof</a>}
            </div>
          </div>
        )}

        {isPaid && (
          <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0"><CheckCircle2 className="h-5 w-5" /></div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Payment Verified - Booking Confirmed!</h3>
              <p className="mt-0.5 text-xs text-emerald-800">Rs. {booking.payment?.amount} paid via {booking.payment?.method} • Verified by admin</p>
            </div>
          </div>
        )}

        {isFailed && booking.status === "ACCEPTED" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0"><AlertCircle className="h-5 w-5" /></div>
              <div><h3 className="text-sm font-bold text-emerald-950">Booking Accepted!</h3><p className="mt-0.5 text-xs text-emerald-800">Please complete payment to finalize.</p></div>
            </div>
            <Link href={`/dashboard/bookings/${booking.id}/pay`} className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 w-full sm:w-auto justify-center">Pay Now</Link>
          </div>
        )}

        {isFailed && booking.status === "PENDING" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0"><CreditCard className="h-5 w-5" /></div>
              <div><h3 className="text-sm font-bold text-blue-950">Payment Required</h3><p className="mt-0.5 text-xs text-blue-800">Your booking is pending. Complete payment to proceed.</p></div>
            </div>
            <Link href={`/dashboard/bookings/${booking.id}/pay`} className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 w-full sm:w-auto justify-center">Pay Now - Rs. {booking.service.price}</Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border bg-white p-6">
            <CardHeader className="p-0 mb-4 pb-3 border-b"><CardTitle className="text-base font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-600" /> Booking Details</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Service Price</span><span className="font-extrabold">Rs. {booking.service.price}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Date</span><span className="font-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</span><span className="font-semibold">{booking.phone}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Address</span><span className="font-semibold text-right ml-4">{booking.address}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500 flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Payment</span>{getPaymentBadge()}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-white p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="p-0 mb-4 pb-3 border-b"><CardTitle className="text-base font-bold flex items-center gap-2"><User className="h-4 w-4 text-blue-600" /> Service Provider</CardTitle></CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-12 w-12 border"><AvatarImage src={booking.service.provider.user.image || ""} /><AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">{booking.service.provider.user.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                  <div><h3 className="font-bold text-sm truncate">{booking.service.provider.user.name}</h3><div className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /><span className="truncate">{booking.service.provider.location || "Nepal"}</span></div></div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 border space-y-2">
                  <div className="flex items-center text-xs gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span>Guaranteed quality</span></div>
                  <div className="flex items-center text-xs gap-2"><Clock className="h-4 w-4 text-blue-600" /><span>Verified contact</span></div>
                </div>
              </CardContent>
            </div>
            <div className="pt-4 border-t">
              {booking.service.provider.verified? <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100"><BadgeCheck className="h-4 w-4" /> Verified Professional</div> : <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100"><AlertCircle className="h-4 w-4" /> Pending Verification</div>}
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-3 rounded-2xl border bg-white p-4">
          {booking.status === "PENDING" && <CancelBookingButton bookingId={booking.id} />}

          {/* PAY BUTTON LOGIC */}
          {isFailed && (
            <Link href={`/dashboard/bookings/${booking.id}/pay`} className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700">Pay Now</Link>
          )}

          {isPending && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-5 py-2.5 text-xs font-bold text-amber-700 border border-amber-200">
              <Ban className="h-4 w-4" /> Pay Disabled - Verification Pending
            </div>
          )}

          {isPaid && booking.status === "COMPLETED" && <ReviewModal serviceId={booking.service.id} />}
          {isPaid && <div className="text-xs text-slate-500">Paid • No further payment needed</div>}
        </div>
      </div>
    </div>
  );
}