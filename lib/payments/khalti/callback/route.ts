import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@/lib/generated/prisma/enums";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pidx = searchParams.get("pidx");
    const purchaseOrderId = searchParams.get("purchase_order_id");
    const status = searchParams.get("status");

    if (!purchaseOrderId) {
      return NextResponse.redirect(
        new URL("/dashboard/bookings?error=Invalid response from Khalti", req.url)
      );
    }

    const payment = await prisma.payment.findFirst({
      where: { transactionUuid: purchaseOrderId },
    });

    if (!payment) {
      return NextResponse.redirect(
        new URL("/dashboard/bookings?error=Transaction not found", req.url)
      );
    }

    if (status === "Completed") {
      // Double check payment status with Khalti API
      const khaltiResponse = await fetch(
        "https://a.khalti.com/api/v2/epayment/lookup/",
        {
          method: "POST",
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pidx }),
        }
      );

      const verificationData = await khaltiResponse.json();

      if (verificationData.status === "Completed") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.SUCCESS },
        });

        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: BookingStatus.ACCEPTED },
        });

        return NextResponse.redirect(
          new URL(
            `/dashboard/bookings/${payment.bookingId}/pay?success=Payment complete`,
            req.url
          )
        );
      }
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });

    return NextResponse.redirect(
      new URL(
        `/dashboard/bookings/${payment.bookingId}/pay?error=Payment failed`,
        req.url
      )
    );
  } catch (error) {
    console.error("Khalti Verification Error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/bookings?error=Verification failed", req.url)
    );
  }
}