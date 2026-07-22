import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {

  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role === "PROVIDER") {
    redirect("/provider/dashboard");
  }


  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
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

    <div className="min-h-screen bg-gray-50 p-10">


      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow">


        <h1 className="text-3xl font-bold">
          Welcome, {user.name} 👋
        </h1>


        <p className="mt-3 text-gray-500">
          Find trusted services near you.
        </p>





        {/* Dashboard Cards */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">


          <Link
            href="/services"
            className="cursor-pointer rounded-xl border p-5 hover:shadow"
          >

            🔍

            <h2 className="mt-2 font-semibold">
              Find Services
            </h2>

          </Link>




          <Link
            href="#bookings"
            className="cursor-pointer rounded-xl border p-5 hover:shadow"
          >

            📅

            <h2 className="mt-2 font-semibold">
              My Bookings
            </h2>

          </Link>




          <Link
            href="#reviews"
            className="cursor-pointer rounded-xl border p-5 hover:shadow"
          >

            ⭐

            <h2 className="mt-2 font-semibold">
              Reviews
            </h2>

          </Link>


        </div>





        {/* Bookings Section */}

        <div
          id="bookings"
          className="mt-10"
        >


          <h2 className="text-2xl font-bold">
            My Bookings
          </h2>




          <div className="mt-5 space-y-4">



            {bookings.length === 0 ? (


              <p className="text-gray-500">
                No bookings yet.
              </p>



            ) : (



              bookings.map((booking) => (


                <div
                  key={booking.id}
                  className="rounded-xl border p-5"
                >



                  <div className="flex justify-between gap-5">



                    <div>


                      <h3 className="text-lg font-bold">
                        {booking.service.name}
                      </h3>



                      <p className="text-gray-600">
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
                      className={`h-fit rounded-full px-3 py-1 ${booking.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >

                      {booking.status}

                    </span>



                  </div>




                  {/* View Details Button */}

                  <div className="mt-4 flex gap-4">

                    <Link
                      href={`/customer/bookings/${booking.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Booking Details →
                    </Link>




                  </div>



                </div>


              ))

            )}



          </div>



        </div>





        {/* Reviews Section */}

        <div
          id="reviews"
          className="mt-10"
        >

          <h2 className="text-2xl font-bold">
            Reviews
          </h2>

          <p className="mt-3 text-gray-500">
            Review feature coming soon.
          </p>

        </div>



      </div>


    </div>

  );
}