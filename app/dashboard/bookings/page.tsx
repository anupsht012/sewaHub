import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import ReviewModal from "@/components/shared/ReviewModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";


export default async function CustomerBookingsPage() {

  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role !== "CUSTOMER") {
    redirect("/");
  }



  const bookings = await prisma.booking.findMany({

    where:{
      customerId:user.id,
    },


    include:{
      service:{
        select:{
          id:true,
          name:true,
          price:true,
          provider:{
            select:{
              user:{
                select:{
                  name:true,
                },
              },
            },
          },
        },
      },
    },


    orderBy:{
      createdAt:"desc",
    },

  });




  return (

    <div className="space-y-6 p-6 lg:p-8">


      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          My Bookings
        </h1>

        <p className="mt-2 text-gray-500">
          Track your service bookings and payments.
        </p>

      </div>





      {
        bookings.length === 0 ? (

          <div className="rounded-xl bg-white p-8 text-center shadow">

            <h2 className="text-xl font-semibold">
              No bookings found
            </h2>

            <p className="mt-2 text-gray-500">
              Your bookings will appear here.
            </p>

          </div>


        ) : (


          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">


            <Table>


              <TableHeader>

                <TableRow>

                  <TableHead>
                    Service
                  </TableHead>


                  <TableHead>
                    Provider
                  </TableHead>


                  <TableHead>
                    Price
                  </TableHead>


                  <TableHead>
                    Date
                  </TableHead>


                  <TableHead>
                    Status
                  </TableHead>


                  <TableHead className="text-right">
                    Action
                  </TableHead>


                </TableRow>

              </TableHeader>





              <TableBody>


                {
                  bookings.map((booking)=>(


                    <TableRow key={booking.id}>


                      <TableCell>

                        <div>

                          <p className="font-semibold">
                            {booking.service.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            Booking ID: {booking.id.slice(0,8)}
                          </p>

                        </div>

                      </TableCell>





                      <TableCell>

                        {
                          booking.service.provider.user.name
                        }

                      </TableCell>





                      <TableCell className="font-semibold">

                        Rs. {booking.service.price}

                      </TableCell>





                      <TableCell>

                        {
                          new Date(
                            booking.bookingDate
                          ).toLocaleDateString()
                        }

                      </TableCell>





                      <TableCell>


                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium

                            ${
                              booking.status==="PENDING"
                              ? "bg-yellow-100 text-yellow-700"

                              : booking.status==="ACCEPTED"
                              ? "bg-green-100 text-green-700"

                              : booking.status==="COMPLETED"
                              ? "bg-blue-100 text-blue-700"

                              : "bg-red-100 text-red-700"
                            }
                          `}
                        >

                          {booking.status}

                        </span>


                      </TableCell>





                      <TableCell className="text-right">


                        <div className="flex justify-end gap-2">


                          <Link
                            href={`/dashboard/bookings/${booking.id}`}
                          >

                            <Button
                              variant="outline"
                              size="sm"
                            >
                              View
                            </Button>

                          </Link>





                          {
                            booking.status==="COMPLETED" && (

                              <ReviewModal
                                serviceId={
                                  booking.service.id
                                }
                              />

                            )
                          }


                        </div>


                      </TableCell>



                    </TableRow>


                  ))
                }



              </TableBody>



            </Table>


          </div>


        )
      }


    </div>

  );
}