import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const user = await getCurrentUser();


    if (!user || user.role !== "PROVIDER") {

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



    const provider = await prisma.provider.findUnique({

      where: {
        userId: user.id,
      },

    });



    if (!provider) {

      return NextResponse.json(
        {
          error: "Provider not found",
        },
        {
          status: 404,
        }
      );

    }






    const booking = await prisma.booking.findFirst({

      where: {

        id,

        service: {
          providerId: provider.id,
        },

      },

      include: {

        payment: true,

        customer: true,

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







    if (booking.status !== "ACCEPTED") {

      return NextResponse.json(
        {
          error:
            "Only accepted bookings can be completed",
        },
        {
          status: 400,
        }
      );

    }







    // IMPORTANT: Check customer payment

    if (
      !booking.payment ||
      booking.payment.status !== "SUCCESS"
    ) {

      return NextResponse.json(
        {
          error:
            "Customer payment is not completed. Cannot mark booking as completed.",
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

        status: "COMPLETED",

      },

    });







    // Notify customer

    await prisma.notification.create({

      data: {

        userId:
          booking.customerId,


        title:
          "Booking Completed",


        message:
          "Your service has been completed. You can leave a review.",


        type:
          "BOOKING_COMPLETED",


        link:
          `/dashboard/bookings/${booking.id}/review`,

      },

    });






    return NextResponse.json(updated);



  } catch(error) {


    console.error(
      "COMPLETE BOOKING ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:"Server error",
      },
      {
        status:500,
      }
    );

  }

}