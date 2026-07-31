import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!data) {
    return NextResponse.redirect(
      `${appUrl}/dashboard/bookings?payment=failed`
    );
  }

  try {
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );

    const { transaction_uuid, status, ref_id } = decodedData;


    if (status === "COMPLETE") {

      const payment = await prisma.payment.update({

        where: {
          transactionUuid: transaction_uuid,
        },

        data: {
          status: "SUCCESS",
          refId: ref_id,
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



      // Notify provider after successful payment
      await prisma.notification.create({

        data: {

          userId: booking.service.provider.user.id,

          title: "Payment Received",

          message:
            "Customer has completed payment for your booking.",

          type: "PAYMENT_SUCCESS",

          link: `/provider/bookings/${booking.id}`,

        },

      });



      // Optional: Notify customer also
      await prisma.notification.create({

        data: {

          userId: booking.customerId,

          title: "Payment Successful",

          message:
            "Your payment has been completed successfully. Your booking is confirmed.",

          type: "PAYMENT_SUCCESS",

          link: `/dashboard/bookings/${booking.id}`,

        },

      });



      return NextResponse.redirect(

        `${appUrl}/dashboard/bookings/${payment.bookingId}?payment=success`

      );

    }



    return NextResponse.redirect(

      `${appUrl}/dashboard/bookings?payment=failed`

    );


  } catch (error) {

    console.error(
      "eSewa verification error:",
      error
    );


    return NextResponse.redirect(

      `${appUrl}/dashboard/bookings?payment=error`

    );

  }
}