import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import CompleteBookingButton from "@/components/provider/CompleteBookingButton";

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
      <div className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-bold">Provider profile not found</h2>
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-2 text-gray-500">
          Manage bookings received from customers.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h2 className="text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 text-gray-500">
            Customer bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Note</TableHead>
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
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.customer.name}</p>
                      <p className="text-xs text-gray-500">
                        {booking.customer.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    Rs. {booking.service.price}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {booking.phone}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-600">
                    {booking.address}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-500">
                    {booking.note || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
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
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "ACCEPTED" && (
                      <CompleteBookingButton bookingId={booking.id} canComplete ={booking.payment?.status === "SUCCESS"} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}