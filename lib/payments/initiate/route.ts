import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(req: Request) {

  try {

    const user = await getCurrentUser();


    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const formData = await req.formData();


    const bookingId = formData.get("bookingId") as string;
    const method = formData.get("method") as string;



    if (!bookingId || !method) {
      return NextResponse.json(
        { error: "Missing data" },
        { status:400 }
      );
    }



    const booking = await prisma.booking.findUnique({

      where:{
        id: bookingId,
      },

      include:{
        service:true,
      },

    });



    if (!booking) {

      return NextResponse.json(
        {
          error:"Booking not found"
        },
        {
          status:404
        }
      );

    }



    if (
      booking.customerId !== user.id
    ) {

      return NextResponse.json(
        {
          error:"Forbidden"
        },
        {
          status:403
        }
      );

    }



    if(method !== "ESEWA") {

      return NextResponse.json(
        {
          error:"Only eSewa implemented"
        },
        {
          status:400
        }
      );

    }



    const transactionUuid =
      `SEWA-${Date.now()}`;



    const payment =
      await prisma.payment.create({

        data:{

          bookingId:booking.id,

          amount:booking.service.price,

          method:"ESEWA",

          status:"PENDING",

          transactionUuid,

        },

      });



    const totalAmount =
      booking.service.price;



    const productCode =
      "EPAYTEST";



    const message =
      `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;



    const signature =
      crypto
      .createHmac(
        "sha256",
        process.env.ESEWA_SECRET_KEY!
      )
      .update(message)
      .digest("base64");



    const html = `

    <html>

    <body onload="document.forms[0].submit()">

    <form method="POST"
    action="https://rc-epay.esewa.com.np/api/epay/main/v2/form">


    <input type="hidden" name="amount" value="${totalAmount}" />

    <input type="hidden" name="tax_amount" value="0" />

    <input type="hidden" name="total_amount" value="${totalAmount}" />

    <input type="hidden" name="transaction_uuid" value="${transactionUuid}" />

    <input type="hidden" name="product_code" value="${productCode}" />

    <input type="hidden" name="product_service_charge" value="0" />

    <input type="hidden" name="product_delivery_charge" value="0" />


    <input type="hidden" name="success_url"
    value="${process.env.NEXT_PUBLIC_APP_URL}/api/payments/esewa/success" />


    <input type="hidden" name="failure_url"
    value="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}/pay?error=Payment Failed" />


    <input type="hidden" name="signature"
    value="${signature}" />


    </form>

    </body>

    </html>

    `;



    return new NextResponse(
      html,
      {
        headers:{
          "Content-Type":"text/html"
        }
      }
    );



  } catch(error) {


    console.error(
      "PAYMENT INIT ERROR",
      error
    );


    return NextResponse.json(
      {
        error:"Server error"
      },
      {
        status:500
      }
    );

  }

}