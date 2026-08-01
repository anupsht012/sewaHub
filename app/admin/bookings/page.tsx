import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import UpdateBookingStatusButton from "@/components/admin/UpdateBookingStatusButton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";



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

      customer: {
        select: {
          name: true,
          email: true,
        },
      },


      service: {

        include: {

          provider: {

            include: {

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


      payment: true,

    },


    orderBy: {
      createdAt: "desc",
    },

  });





  return (

    <div className="min-h-screen bg-gray-50 p-6 md:p-8">


      <div className="mx-auto max-w-7xl space-y-6">


        <div>

          <h1 className="text-3xl font-bold">
            Manage Bookings
          </h1>


          <p className="mt-2 text-gray-500">
            Review and manage all customer bookings.
          </p>

        </div>





        {
          bookings.length === 0 ? (

            <Card>

              <CardContent className="p-8 text-center">
                No bookings found.
              </CardContent>

            </Card>


          ) : (


            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


              {
                bookings.map((booking)=>(


                  <Card
                    key={booking.id}
                    className="rounded-2xl shadow-sm"
                  >


                    <CardHeader>


                      <div className="flex items-start justify-between gap-3">


                        <div>

                          <CardTitle className="text-xl">

                            {booking.service.name}

                          </CardTitle>


                          <p className="mt-1 text-sm text-gray-500">

                            Rs. {booking.service.price}

                          </p>


                        </div>



                        <Badge

                          className={

                            booking.status === "COMPLETED"

                            ? "bg-blue-100 text-blue-700"

                            :

                            booking.status === "ACCEPTED"

                            ? "bg-green-100 text-green-700"

                            :

                            booking.status === "CANCELLED"

                            ? "bg-gray-100 text-gray-700"

                            :

                            "bg-yellow-100 text-yellow-700"

                          }

                        >

                          {booking.status}

                        </Badge>


                      </div>


                    </CardHeader>





                    <CardContent className="space-y-5">


                      <div>


                        <h3 className="font-semibold">
                          Customer
                        </h3>


                        <p className="text-sm">
                          👤 {booking.customer.name}
                        </p>


                        <p className="text-sm text-gray-500">
                          ✉ {booking.customer.email}
                        </p>


                      </div>





                      <Separator />





                      <div>


                        <h3 className="font-semibold">
                          Provider
                        </h3>


                        <p className="text-sm">
                          🧑‍🔧 {booking.service.provider.user.name}
                        </p>


                        <p className="text-sm text-gray-500">
                          ✉ {booking.service.provider.user.email}
                        </p>


                      </div>





                      <Separator />





                      <div className="grid grid-cols-2 gap-3 text-sm">


                        <div>

                          <p className="font-medium">
                            Date
                          </p>

                          <p className="text-gray-500">

                            {
                              new Date(
                                booking.bookingDate
                              ).toLocaleDateString()
                            }

                          </p>

                        </div>




                        <div>

                          <p className="font-medium">
                            Payment
                          </p>


                          {
                            booking.payment ? (

                              <Badge

                                variant="outline"

                                className={
                                  booking.payment.status === "SUCCESS"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                                }

                              >

                                {booking.payment.status}

                              </Badge>


                            ) : (

                              <p className="text-gray-400">
                                Not paid
                              </p>

                            )

                          }


                        </div>


                      </div>





                      <div>

                        <p className="font-medium">
                          Address
                        </p>

                        <p className="text-sm text-gray-500">
                          📍 {booking.address}
                        </p>

                      </div>





                      <Separator />





                      <UpdateBookingStatusButton

                        bookingId={booking.id}

                        status={booking.status}

                      />



                    </CardContent>


                  </Card>


                ))
              }


            </div>


          )
        }



      </div>


    </div>

  );

}