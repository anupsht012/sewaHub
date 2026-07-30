import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect, notFound } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CustomerPayPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
}

export default async function CustomerPayPage({
  params,
  searchParams,
}: CustomerPayPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const { error, success } = await searchParams;

  // Fetch booking details based on route param [id]
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
          description: true,
          provider: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payment: true,
    },
  });

  if (!booking) {
    notFound();
  }

  // Ensure only the customer who owns the booking (or an admin) can access this page
  if (booking.customerId !== user.id && user.role !== "ADMIN") {
    redirect("/dashboard/bookings");
  }

  const latestPayment = booking.payment;
  const isPaid = latestPayment?.status === "SUCCESS";

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to Booking Details
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <Badge variant="outline" className="mb-2 border-blue-200 bg-blue-50 text-blue-700">
                Secure Payment
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Complete Your Payment
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review your service details and select your preferred payment gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <p>Payment processed successfully! Your booking is now confirmed.</p>
          </div>
        )}

        {isPaid ? (
          /* Payment Completed View */
          <Card className="rounded-3xl border-emerald-100 bg-white p-6 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="rounded-full bg-emerald-100 p-4 text-emerald-600">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Completed</h2>
              <p className="max-w-md text-sm text-gray-500">
                This booking has already been settled and confirmed.
              </p>

              <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-left w-full max-w-sm space-y-2 border border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Transaction UUID</span>
                  <span className="font-mono font-medium text-gray-900">
                    {latestPayment.transactionUuid || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Amount Paid</span>
                  <span className="font-bold text-gray-900">
                    Rs. {latestPayment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Payment Method</span>
                  <span className="font-semibold uppercase text-gray-700">
                    {latestPayment.method}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  View All Bookings
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Checkout Layout */
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Booking Summary */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="rounded-3xl border-gray-100 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Summary
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Booking #{booking.id.slice(-8)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 rounded-2xl bg-gray-50/80 p-4 border border-gray-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-900">{booking.service.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{booking.service.category}</p>
                      </div>
                      <p className="font-bold text-gray-900">
                        Rs. {booking.service.price.toLocaleString()}
                      </p>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          Provider: <strong className="text-gray-800">{booking.service?.provider?.user?.name || "Assigned Specialist"}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          Date: {new Date(booking.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Service Fee</span>
                      <span>Rs. {booking.service.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Gateway Fee</span>
                      <span>Rs. 0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                      <span>Total Amount</span>
                      <span className="text-blue-600">
                        Rs. {booking.service.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-blue-50/60 p-3 text-xs text-blue-700">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                    <span>Transactions are secured with 256-bit encryption.</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Gateways */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="rounded-3xl border-gray-100 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Select Payment Method
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Choose your preferred checkout gateway
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* eSewa Option */}
                  <form action="/api/payments/initiate" method="POST">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="method" value="ESEWA" />

                    <button
                      type="submit"
                      className="group flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm">
                          eSewa
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700">
                            eSewa Wallet
                          </p>
                          <p className="text-xs text-gray-500">
                            Pay via eSewa digital wallet
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>

                  {/* Khalti Option */}
                  <form action="/api/payments/initiate" method="POST">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="method" value="KHALTI" />

                    <button
                      type="submit"
                      className="group flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-purple-500 hover:bg-purple-50/30 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm">
                          Khalti
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 group-hover:text-purple-700">
                            Khalti Wallet
                          </p>
                          <p className="text-xs text-gray-500">
                            Instant checkout via Khalti
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>

                  {/* Cash Option */}
                  <form action="/api/payments/initiate" method="POST">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="method" value="CASH" />

                    <button
                      type="submit"
                      className="group flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:bg-blue-50/30 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-700">
                            Cash On Delivery
                          </p>
                          <p className="text-xs text-gray-500">
                            Pay in person after service completion
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
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