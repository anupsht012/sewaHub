import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";

export default async function CustomerBookingsPage() {

  const user = await getCurrentUser();

  if (!user || user.role !== "CUSTOMER") {
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
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold">
          My Bookings
        </h1>


        <div className="mt-8 space-y-5">

          {bookings.length === 0 ? (

            <p className="text-gray-500">
              No bookings yet.
            </p>

          ) : (

            bookings.map((booking) => (

              <div
                key={booking.id}
                className="rounded-2xl bg-white p-6 shadow"
              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-xl font-bold">
                      {booking.service.name}
                    </h2>


                    <p className="mt-2 text-gray-600">
                      Provider:{" "}
                      {booking.service.provider.user.name}
                    </p>


                    <p className="text-gray-600">
                      Price: Rs. {booking.service.price}
                    </p>


                    <p className="text-gray-600">
                      Date:{" "}
                      {new Date(
                        booking.bookingDate
                      ).toLocaleDateString()}
                    </p>

                  </div>


                  <span
                    className={`h-fit rounded-full px-3 py-1 ${
                      booking.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>


                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}