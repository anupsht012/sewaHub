import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { generateEsewaSignature } from "@/lib/payments/esewa";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, method } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          include: {
            provider: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const transactionUuid = `${bookingId}-${Date.now()}`;
    
    // Amount comes from the associated Service model
    const amount = booking.service.price;
    
    // Provider User ID comes from the associated Provider record
    const providerUserId = booking.service.provider.userId;

    // Store or update pending payment record
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: {
        amount,
        method,
        status: "PENDING",
        transactionUuid,
      },
      create: {
        bookingId,
        customerId: user.id,
        providerId: providerUserId,
        amount,
        method,
        status: "PENDING",
        transactionUuid,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. ESEWA FLOW
    if (method === "ESEWA") {
      const productCode = process.env.NEXT_PUBLIC_ESEWA_PRODUCT_CODE || "EPAYTEST";
      const signature = generateEsewaSignature(
        amount.toString(),
        transactionUuid,
        productCode
      );

      return NextResponse.json({
        provider: "ESEWA",
        paymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        formData: {
          amount: amount.toString(),
          tax_amount: "0",
          total_amount: amount.toString(),
          transaction_uuid: transactionUuid,
          product_code: productCode,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${appUrl}/api/payments/verify/esewa`,
          failure_url: `${appUrl}/dashboard/bookings/${bookingId}?payment=failed`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature,
        },
      });
    }

    // 2. KHALTI FLOW
    if (method === "KHALTI") {
      const response = await fetch(
        "https://a.khalti.com/api/v2/epay/initiate/",
        {
          method: "POST",
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            return_url: `${appUrl}/api/payments/verify/khalti`,
            website_url: appUrl,
            amount: Math.round(amount * 100), // Convert to paisa
            purchase_order_id: transactionUuid,
            purchase_order_name: `Booking #${bookingId}`,
            customer_info: {
              name: user.name || "Customer",
              email: user.email || "customer@sewahub.np",
            },
          }),
        }
      );

      const khaltiData = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: khaltiData.detail || "Khalti payment initialization failed" },
          { status: 400 }
        );
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: { pidx: khaltiData.pidx },
      });

      return NextResponse.json({
        provider: "KHALTI",
        paymentUrl: khaltiData.payment_url,
      });
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}