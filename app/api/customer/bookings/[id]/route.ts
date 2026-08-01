import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const user = await getCurrentUser();


    if (!user || user.role !== "CUSTOMER") {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }



    const { id } = await params;



    const booking = await prisma.booking.findFirst({

      where: {

        id,

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

    });





    if (!booking) {

      return NextResponse.json(

        {
          error: "Booking not found",
        },

        {
          status: 404,
        }

      );

    }





    if (booking.status !== "PENDING") {

      return NextResponse.json(

        {
          error:
            "Only pending bookings can be cancelled",
        },

        {
          status: 400,
        }

      );

    }





    const updated = await prisma.booking.update({

      where: {

        id,

      },

      data: {

        status: "CANCELLED",

      },

    });







    // Notify provider about cancellation
    await prisma.notification.create({

      data: {

        userId:
          booking.service.provider.user.id,


        title:
          "Booking Cancelled",


        message:
          "Customer cancelled the booking.",


        type:
          "BOOKING_CANCELLED",


        link:
          `/provider/bookings/${booking.id}`,

      },

    });







    // Optional: Notify customer also
    await prisma.notification.create({

      data: {

        userId:
          user.id,


        title:
          "Booking Cancelled",


        message:
          "Your booking has been cancelled successfully.",


        type:
          "BOOKING_CANCELLED",


        link:
          `/dashboard/bookings/${booking.id}`,

      },

    });







    return NextResponse.json(updated);




  } catch (error) {


    console.error(
      "CANCEL BOOKING ERROR:",
      error
    );


    return NextResponse.json(

      {
        error:
          "Server error",
      },

      {
        status: 500,
      }

    );

  }

}