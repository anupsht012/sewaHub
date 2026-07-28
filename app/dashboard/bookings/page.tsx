import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import ReviewModal from "@/components/shared/ReviewModal";

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

  return (
    <div
      className="
        p-4
        sm:p-6
        lg:p-8
        space-y-6
      "
    >
      {/* Header */}
      <div>
        <h1
          className="
            text-2xl
            md:text-3xl
            font-bold
          "
        >
          My Bookings
        </h1>

        <p className="mt-2 text-gray-500">
          Track your booked services and status.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div
          className="
            rounded-2xl
            bg-white
            p-8
            text-center
            shadow-sm
          "
        >
          <h2 className="text-xl font-semibold">
            No bookings yet
          </h2>

          <p className="mt-2 text-gray-500">
            Your booked services will appear here.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="
                group
                flex
                flex-col
                justify-between
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-lg
              "
            >
              {/* Clickable Area: Navigates to Booking Details */}
              <Link
                href={`/customer/bookings/${booking.id}`}
                className="block flex-1 space-y-4 cursor-pointer"
              >
                <div className="flex justify-between gap-3">
                  <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {booking.service.name}
                  </h2>

                  <span
                    className={`
                      h-fit
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {booking.status}
                  </span>
                </div>

                <div
                  className="
                    space-y-2
                    text-sm
                    text-gray-600
                  "
                >
                  <p>
                    <b>Provider:</b>{" "}
                    {booking.service.provider.user.name}
                  </p>

                  <p>
                    <b>Price:</b> ${booking.service.price}
                  </p>

                  <p>
                    <b>Date:</b>{" "}
                    {new Date(
                      booking.bookingDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <b>Phone:</b> {booking.phone}
                  </p>

                  <p>
                    <b>Address:</b> {booking.address}
                  </p>

                  {booking.note && (
                    <p>
                      <b>Note:</b> {booking.note}
                    </p>
                  )}
                </div>
              </Link>

              {/* Action Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View Details &rarr;
                </Link>

                {booking.status === "COMPLETED" && (
                  <div>
                    <ReviewModal
                      serviceId={booking.service.id}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}