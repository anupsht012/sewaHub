import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import UpdateBookingStatusButton from "@/components/admin/UpdateBookingStatusButton";



export default async function AdminBookingsPage() {


  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role !== "ADMIN") {
    redirect("/");
  }



  const bookings = await prisma.booking.findMany({

    include: {

      customer: true,

      service: {

        include: {

          provider: {

            include: {

              user:true,

            },

          },

        },

      },

    },


    orderBy: {

      createdAt:"desc",

    },


  });





  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-7xl">


        <h1 className="text-3xl font-bold">
          Manage Bookings
        </h1>


        <p className="mt-2 text-gray-500">
          Monitor and manage all service bookings.
        </p>




        <div className="mt-8 space-y-5">


          {
            bookings.length === 0 ? (

              <div className="rounded-2xl bg-white p-8 shadow">
                No bookings found.
              </div>


            ) : (


              bookings.map((booking)=>(


                <div
                  key={booking.id}
                  className="rounded-3xl bg-white p-6 shadow"
                >



                  <div className="flex justify-between">


                    <div className="space-y-2">


                      <h2 className="text-xl font-bold">
                        {booking.service.name}
                      </h2>



                      <p>
                        👤 Customer:
                        {" "}
                        {booking.customer.name}
                      </p>



                      <p>
                        🧑‍🔧 Provider:
                        {" "}
                        {booking.service.provider.user.name}
                      </p>



                      <p>
                        📅
                        {" "}
                        {new Date(
                          booking.bookingDate
                        ).toLocaleDateString()}
                      </p>



                      <p>
                        📍 {booking.address}
                      </p>



                      <p>
                        📞 {booking.phone}
                      </p>


                    </div>





                    <div className="text-right">


                      <span
                        className="
                        rounded-full
                        bg-blue-100
                        px-4
                        py-2
                        text-blue-700
                        "
                      >

                        {booking.status}

                      </span>



                      <div className="mt-5">

                        <UpdateBookingStatusButton
                          bookingId={booking.id}
                          status={booking.status}
                        />

                      </div>


                    </div>



                  </div>



                </div>


              ))

            )
          }



        </div>


      </div>


    </div>

  );
}