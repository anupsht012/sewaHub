import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";

import Link from "next/link";

import CancelBookingButton from "@/components/shared/CancelBookingButton";
import ReviewModal from "@/components/shared/ReviewModal";

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

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 md:p-8 shadow-sm">
        <Link
          href="/dashboard/bookings"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Bookings
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {booking.service.name}
            </h1>

            <p className="mt-3 text-gray-600">
              {booking.service.description}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              booking.status === "ACCEPTED"
                ? "bg-green-100 text-green-700"
                : booking.status === "COMPLETED"
                ? "bg-blue-100 text-blue-700"
                : booking.status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : booking.status === "CANCELLED"
                ? "bg-gray-100 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {booking.status}
          </span>
        </div>

        {/* Payment Required Alert Banner */}
        {booking.status === "ACCEPTED" && !isPaid && (
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-emerald-900">
                Booking Accepted by Provider!
              </h3>
              <p className="mt-1 text-sm text-emerald-700">
                Please complete your payment to finalize the service request.
              </p>
            </div>
            <Link
              href={`/dashboard/bookings/${booking.id}/pay`}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Pay Now
            </Link>
          </div>
        )}

        {/* Booking Information */}
        <div className="mt-8 rounded-2xl border p-5">
          <h2 className="text-xl font-bold">
            Booking Information
          </h2>

          <div className="mt-4 space-y-2 text-gray-600">
            <p>
              Price: Rs. {booking.service.price}
            </p>

            <p>
              Booking Date:{" "}
              {new Date(
                booking.bookingDate
              ).toLocaleDateString()}
            </p>

            <p>
              Phone: {booking.phone}
            </p>

            <p>
              Address: {booking.address}
            </p>

            <p>
              Note: {booking.note || "No note"}
            </p>

            <p>
              Payment Status:{" "}
              <span className="font-semibold text-gray-900">
                {isPaid ? "Paid" : "Unpaid"}
              </span>
            </p>
          </div>
        </div>

        {/* Provider Details */}
        <div className="mt-6 rounded-2xl border p-5">
          <h2 className="text-xl font-bold">
            Provider Details
          </h2>

          <div className="mt-4 space-y-2 text-gray-600">
            <p>
              Name: {booking.service.provider.user.name}
            </p>

            <p>
              Location: {booking.service.provider.location}
            </p>
          </div>

          {booking.service.provider.verified ? (
            <p className="mt-3 text-green-600">
              ✅ Verified Provider
            </p>
          ) : (
            <p className="mt-3 text-yellow-600">
              Pending Verification
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          {booking.status === "PENDING" && (
            <CancelBookingButton
              bookingId={booking.id}
            />
          )}

          {booking.status === "ACCEPTED" && !isPaid && (
            <Link
              href={`/dashboard/bookings/${booking.id}/pay`}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Pay Now
            </Link>
          )}

          {booking.status === "COMPLETED" && (
            <ReviewModal
              serviceId={booking.service.id}
            />
          )}
        </div>
      </div>
    </div>
  );
} 