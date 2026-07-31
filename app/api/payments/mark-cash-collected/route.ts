import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { PaymentStatus } from "@/lib/generated/prisma/enums";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    if (user.role !== "PROVIDER" && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Forbidden: Only providers or admins can perform this action",
        },
        {
          status: 403,
        }
      );
    }


    const body = await req.json();

    const { paymentId } = body;


    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json(
        {
          error: "Payment ID is required",
        },
        {
          status: 400,
        }
      );
    }



    // Fetch payment with booking customer information
    const payment = await prisma.payment.findUnique({

      where: {
        id: paymentId,
      },

      include: {

        booking: {

          include: {

            customer: true,

            service: {

              select: {
                providerId: true,
              },

            },

          },

        },

      },

    });



    if (!payment) {
      return NextResponse.json(
        {
          error: "Payment record not found",
        },
        {
          status: 404,
        }
      );
    }




    // Verify provider ownership
    if (user.role === "PROVIDER") {

      const provider = await prisma.provider.findUnique({

        where: {
          userId: user.id,
        },

      });



      if (
        !provider ||
        payment.booking.service.providerId !== provider.id
      ) {

        return NextResponse.json(
          {
            error:
              "You are not authorized to update this payment",
          },
          {
            status: 403,
          }
        );

      }

    }




    // Only cash payments can be collected manually
    if (payment.method !== "CASH") {

      return NextResponse.json(
        {
          error:
            "Only cash payments can be marked as collected",
        },
        {
          status: 400,
        }
      );

    }




    if (payment.status === PaymentStatus.SUCCESS) {

      return NextResponse.json(
        {
          error:
            "Payment is already marked as collected",
        },
        {
          status: 400,
        }
      );

    }




    // Update payment status
    const updatedPayment = await prisma.payment.update({

      where: {
        id: paymentId,
      },

      data: {

        status: PaymentStatus.SUCCESS,

      },

    });





    // Prevent duplicate notifications
    const existingNotification =
      await prisma.notification.findFirst({

        where: {

          userId: payment.booking.customerId,

          type: "PAYMENT_SUCCESS",

          link:
            `/dashboard/bookings/${payment.booking.id}`,

        },

      });




    if (!existingNotification) {

      await prisma.notification.create({

        data: {

          userId: payment.booking.customerId,

          title:
            "Cash Payment Confirmed",

          message:
            "Your cash payment has been confirmed by the provider.",

          type:
            "PAYMENT_SUCCESS",

          link:
            `/dashboard/bookings/${payment.booking.id}`,

        },

      });

    }





    return NextResponse.json(

      {
        message:
          "Payment marked as collected successfully",

        payment:
          updatedPayment,

      },

      {
        status: 200,
      }

    );



  } catch (error) {

    console.error(
      "Error updating payment status:",
      error
    );


    return NextResponse.json(

      {
        error:
          "Internal Server Error",
      },

      {
        status: 500,
      }

    );

  }
}