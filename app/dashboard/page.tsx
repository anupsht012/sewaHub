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

      {/* Recent Requests Table */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Recent Requests
          </h2>

          <Link
            href="/dashboard/requests"
            className="text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {requests.length === 0 ? (
          <p className="text-gray-500">
            No requests yet.
          </p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-semibold">
                      {request.title}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {request.location}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {request.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Recent Bookings
          </h2>

          <Link
            href="/dashboard/bookings"
            className="text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-gray-500">
            No bookings yet.
          </p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-semibold">
                      {booking.service.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {booking.service.provider.user.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      ${booking.service.price}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Details &rarr;
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}