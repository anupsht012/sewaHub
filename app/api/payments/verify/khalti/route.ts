import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pidx = searchParams.get("pidx");
  const status = searchParams.get("status");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!pidx || status !== "Completed") {
    return NextResponse.redirect(`${appUrl}/dashboard/bookings?payment=failed`);
  }

  try {
    const response = await fetch("https://a.khalti.com/api/v2/epay/lookup/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const verifyData = await response.json();

    if (response.ok && verifyData.status === "Completed") {
      const payment = await prisma.payment.update({
        where: { pidx },
        data: {
          status: "SUCCESS",
          refId: verifyData.transaction_id,
        },
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "ACCEPTED" },
      });

      return NextResponse.redirect(
        `${appUrl}/dashboard/bookings/${payment.bookingId}?payment=success`
      );
    }

    return NextResponse.redirect(`${appUrl}/dashboard/bookings?payment=failed`);
  } catch (error) {
    console.error("Khalti verification error:", error);
    return NextResponse.redirect(`${appUrl}/dashboard/bookings?payment=error`);
  }
}