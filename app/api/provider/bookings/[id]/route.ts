import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


console.log("BOOKING PATCH ROUTE LOADED");


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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



    const body = await req.json();


    const { status } = body;




    if (
      ![
        "ACCEPTED",
        "REJECTED",
        "COMPLETED",
      ].includes(status)
    ) {

      return NextResponse.json(
        {
          error: "Invalid status",
        },
        {
          status: 400,
        }
      );

    }





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

        service: true,

        payment: true,

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







    // Prevent completing without successful payment
    if (status === "COMPLETED") {


      if (
        !booking.payment ||
        booking.payment.status !== "SUCCESS"
      ) {


        return NextResponse.json(
          {
            error:
              "Payment must be completed before marking booking as completed.",
          },
          {
            status: 400,
          }
        );


      }


    }








    const updated = await prisma.booking.update({

      where: {

        id,

      },

      data: {

        status,

      },

    });








    // Provider accepted booking
    if (status === "ACCEPTED") {


      await prisma.notification.create({

        data: {

          userId:
            booking.customerId,


          title:
            "Booking Accepted",


          message:
            "Your booking has been accepted. Please complete your payment.",


          type:
            "BOOKING_ACCEPTED",


          link:
            `/dashboard/bookings/${booking.id}/pay`,

        },

      });


    }








    // Provider rejected booking
    if (status === "REJECTED") {


      await prisma.notification.create({

        data: {

          userId:
            booking.customerId,


          title:
            "Booking Rejected",


          message:
            "Unfortunately, your booking request was rejected by the provider.",


          type:
            "BOOKING_REJECTED",


          link:
            `/dashboard/bookings/${booking.id}`,

        },

      });


    }








    // Provider completed booking
    if (status === "COMPLETED") {


      await prisma.notification.create({

        data: {

          userId:
            booking.customerId,


          title:
            "Booking Completed",


          message:
            "Your service has been completed. You can now leave a review.",


          type:
            "BOOKING_COMPLETED",


          link:
            `/dashboard/bookings/${booking.id}/review`,

        },

      });


    }







    return NextResponse.json(updated);





  } catch (error) {


    console.error(
      "UPDATE BOOKING ERROR:",
      error
    );


    return NextResponse.json(

      {
        error:
          "Server error",
      },

      {
        status:500,
      }

    );


  }

}