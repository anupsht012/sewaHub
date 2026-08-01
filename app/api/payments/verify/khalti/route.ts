import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pidx = searchParams.get("pidx");
  const status = searchParams.get("status");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";


  if (!pidx || status !== "Completed") {
    return NextResponse.redirect(
      `${appUrl}/dashboard/bookings?payment=failed`
    );
  }


  try {

    const response = await fetch(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        method: "POST",

        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          pidx,
        }),
      }
    );


    const verifyData = await response.json();



    if (response.ok && verifyData.status === "Completed") {


      const payment = await prisma.payment.update({

        where: {
          pidx,
        },

        data: {
          status: "SUCCESS",
          refId: verifyData.transaction_id,
        },

      });



      const booking = await prisma.booking.update({

        where: {
          id: payment.bookingId,
        },

        data: {
          status: "ACCEPTED",
        },


        include: {

          customer: true,

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



      // Notify Provider
      await prisma.notification.create({

        data: {

          userId: booking.service.provider.user.id,

          title: "Payment Received",

          message:
            "Customer has completed payment for your booking.",

          type: "PAYMENT_SUCCESS",

          link:
            `/provider/bookings/${booking.id}`,

        },

      });



      // Notify Customer
      await prisma.notification.create({

        data: {

          userId: booking.customerId,

          title: "Payment Successful",

          message:
            "Your payment has been completed successfully. Your booking is confirmed.",

          type: "PAYMENT_SUCCESS",

          link:
            `/dashboard/bookings/${booking.id}`,

        },

      });



      return NextResponse.redirect(

        `${appUrl}/dashboard/bookings/${payment.bookingId}?payment=success`

      );

    }



    // Payment verification failed

    const failedPayment = await prisma.payment.findUnique({

      where: {
        pidx,
      },

      include: {
        booking: true,
      },

    });



    if (failedPayment) {

      await prisma.payment.update({

        where: {
          pidx,
        },

        data: {
          status: "FAILED",
        },

      });



      await prisma.notification.create({

        data: {

          userId: failedPayment.booking.customerId,

          title: "Payment Failed",

          message:
            "Your payment failed. Please try again.",

          type: "PAYMENT_FAILED",

          link:
            `/dashboard/bookings/${failedPayment.bookingId}/pay`,

        },

      });

    }



    return NextResponse.redirect(
      `${appUrl}/dashboard/bookings?payment=failed`
    );


  } catch (error) {


    console.error(
      "Khalti verification error:",
      error
    );


    return NextResponse.redirect(
      `${appUrl}/dashboard/bookings?payment=error`
    );

  }
}