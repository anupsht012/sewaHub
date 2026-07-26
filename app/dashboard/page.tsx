import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">
          Welcome back, {user.name} 👋
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your requests and bookings.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Bookings</p>

          <h2 className="mt-2 text-3xl font-bold">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Requests</p>

          <h2 className="mt-2 text-3xl font-bold">
            {requests.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Reviews</p>

          <h2 className="mt-2 text-3xl font-bold">
            {reviewCount}
          </h2>
        </div>

        <Link
          href="/services"
          className="rounded-2xl bg-blue-600 p-6 text-white shadow transition hover:bg-blue-700"
        >
          <p>Need a service?</p>

          <h2 className="mt-3 text-2xl font-bold">
            Find Services →
          </h2>
        </Link>
      </div>

      {/* Recent Requests */}

      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Recent Requests
          </h2>

          <Link
            href="/dashboard/requests"
            className="text-blue-600"
          >
            View All
          </Link>
        </div>

        {requests.length === 0 ? (
          <p className="text-gray-500">
            No requests yet.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border p-4"
              >
                <h3 className="font-bold">
                  {request.title}
                </h3>

                <p className="text-gray-500">
                  {request.location}
                </p>

                <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings */}

      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Recent Bookings
          </h2>

          <Link
            href="/dashboard/bookings"
            className="text-blue-600"
          >
            View All
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-gray-500">
            No bookings yet.
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="rounded-xl border p-4"
              >
                <h3 className="font-bold">
                  {booking.service.name}
                </h3>

                <p className="text-gray-500">
                  {booking.service.provider.user.name}
                </p>

                <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}