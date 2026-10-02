import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect, notFound } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ManualQRForm from "@/components/customer/ManualQRForm";

interface CustomerPayPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string; method?: string }>;
}

export default async function CustomerPayPage({ params, searchParams }: CustomerPayPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const { error, success, method } = await searchParams;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: {
        select: {
          id: true, name: true, category: true, price: true, description: true,
          provider: { select: { id: true, user: { select: { name: true, email: true } } } },
        },
      },
      customer: { select: { id: true, name: true, email: true } },
      payment: true,
    },
  });

  if (!booking) notFound();
  if (booking.customerId!== user.id && user.role!== "ADMIN") {
    redirect("/dashboard/bookings");
  }

  const latestPayment = booking.payment;
  const isPaid = latestPayment?.status === "SUCCESS";
  const isManualPending =
    latestPayment?.status === "PENDING" &&
    ((latestPayment?.method as string) === "MANUAL_ESEWA" ||
      (latestPayment?.method as string) === "MANUAL_BANK");

  if (method === "MANUAL_ESEWA" || method === "MANUAL_BANK") {
    const isEsewa = method === "MANUAL_ESEWA";
    const qrSrc = isEsewa? "/qr/esewa-qr.jpg" : "/qr/bank-qr.jpg";
    const title = isEsewa? "Pay via Personal eSewa" : "Pay via Bank Transfer";
    const accountInfo = isEsewa
     ? "eSewa ID: 9748284837 (Anup Tapi Shrestha)"
      : "Citizens Bank - Acc: 0260100000145041 (Anup Tapi Shrestha), Thimi Branch";

    return (
      <div className="min-h-screen bg-gray-50/50 py-10 px-4">
        <div className="mx-auto max-w-xl space-y-6">
          <Link href={`/dashboard/bookings/${booking.id}/pay`} className="inline-flex items-center text-xs text-gray-500 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Payment Methods
          </Link>

          <Card className="rounded-3xl border-gray-100">
            <CardHeader className="text-center">
              <CardTitle>{title}</CardTitle>
              <CardDescription>Amount: Rs. {booking.service.price.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <img src={qrSrc} alt="QR" className="w-72 h-72 mx-auto rounded-xl border object-contain bg-white" />
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">{accountInfo}</p>
              <div className="text-left bg-yellow-50 p-4 rounded-xl text-xs space-y-1">
                <p>1. Open {isEsewa? "eSewa" : "your bank app"} and scan QR</p>
                <p>2. Pay exact amount Rs. {booking.service.price.toLocaleString()}</p>
                <p>3. Take screenshot of success page</p>
                <p>4. Upload below</p>
              </div>
              <ManualQRForm bookingId={booking.id} method={method} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <Link href={`/dashboard/bookings/${booking.id}`} className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Booking Details
          </Link>
          <div>
            <Badge variant="outline" className="mb-2 border-blue-200 bg-blue-50 text-blue-700">Secure Payment</Badge>
            <h1 className="text-3xl font-bold tracking-tight">Complete Your Payment</h1>
            <p className="mt-1 text-sm text-gray-500">Select your preferred payment method.</p>
          </div>
        </div>

        {error && <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle className="h-5 w-5" /><p>{error}</p></div>}
        {success && <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 className="h-5 w-5" /><p>{success}</p></div>}

        {isPaid? (
          <Card className="rounded-3xl p-6 text-center">
            <CardContent className="py-8 space-y-4">
              <div className="mx-auto w-fit rounded-full bg-emerald-100 p-4 text-emerald-600"><CheckCircle2 className="h-12 w-12" /></div>
              <h2 className="text-2xl font-bold">Payment Completed</h2>
              <p className="text-sm text-gray-500">Rs. {latestPayment.amount.toLocaleString()} via {latestPayment.method}</p>
              <Link href="/dashboard/bookings" className="inline-flex rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white">View All Bookings</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Card className="rounded-3xl">
                <CardHeader><CardTitle>Summary</CardTitle><CardDescription>Booking #{booking.id.slice(-8)}</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-gray-50 p-4 border">
                    <p className="font-bold">{booking.service.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{booking.service.category}</p>
                    <p className="font-bold mt-2">Rs. {booking.service.price.toLocaleString()}</p>
                  </div>
                  {isManualPending && <div className="rounded-xl bg-yellow-50 p-3 text-xs text-yellow-800 border border-yellow-200">Your {latestPayment.method} proof is pending verification.</div>}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Card className="rounded-3xl">
                <CardHeader><CardTitle>Select Payment Method</CardTitle><CardDescription>Choose how you want to pay</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/dashboard/bookings/${booking.id}/pay?method=MANUAL_ESEWA`} className="flex w-full items-center justify-between rounded-2xl border-2 border-green-200 bg-green-50 p-4 hover:border-green-500">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#60BB46] text-white font-bold text-xs">eSewa</div>
                      <div className="text-left">
                        <p className="font-semibold">eSewa Personal QR</p>
                        <p className="text-xs text-gray-500">Scan my QR & upload screenshot</p>
                        <Badge className="mt-1 bg-green-600 text-white text-">RECOMMENDED - INSTANT</Badge>
                      </div>
                    </div>
                    <QrCode className="h-5 w-5 text-green-600" />
                  </Link>

                  <Link href={`/dashboard/bookings/${booking.id}/pay?method=MANUAL_BANK`} className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-blue-500 hover:bg-blue-50/30">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"><Landmark className="h-6 w-6" /></div>
                      <div className="text-left"><p className="font-semibold">Bank Transfer / Fonepay QR</p><p className="text-xs text-gray-500">Pay to my bank - upload proof</p></div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Link>

                  <Separator />

                  <form action="/api/payments/initiate" method="POST">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="method" value="CASH" />
                    <button type="submit" className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-blue-500">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white"><CreditCard className="h-6 w-6" /></div>
                        <div className="text-left"><p className="font-semibold">Cash on Service</p><p className="text-xs text-gray-500">Pay after service</p></div>
                      </div>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}