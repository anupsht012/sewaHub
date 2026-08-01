import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@/lib/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/get-user";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url), 303);
    }

    const formData = await req.formData();

    const bookingId = formData.get("bookingId")?.toString();
    const method = formData.get("method")?.toString() as PaymentMethod;

    if (!bookingId || !method) {
      return NextResponse.json(
        { error: "Missing bookingId or method" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
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

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Ensure only the customer or an admin can initiate payment
    if (booking.customerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access to this booking" },
        { status: 403 }
      );
    }

    // Sanitize transaction UUID (alphanumeric and hyphens only)
    const transactionUuid = `TXN-${booking.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6)}-${Date.now()}`;
    const amountVal = booking.service.price;

    // Use upsert to handle re-initiated payments without unique constraint errors on bookingId
    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        amount: amountVal,
        method,
        status: PaymentStatus.PENDING,
        transactionUuid,
      },
      create: {
        bookingId: booking.id,
        amount: amountVal,
        method,
        status: PaymentStatus.PENDING,
        transactionUuid,
      },
    });

    // 1. CASH ON DELIVERY
    if (method === PaymentMethod.CASH) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/bookings/${booking.id}/pay?success=Cash payment option selected`,
          req.url
        ),
        303
      );
    }

    // 2. eSEWA PAYMENT GATEWAY
    if (method === PaymentMethod.ESEWA) {
      const formattedAmount = String(amountVal);
      const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
      const secretKey = process.env.ESEWA_SECRET_KEY || "8gBmStructureSecret";
      const paymentUrl =
        process.env.ESEWA_PAYMENT_URL ||
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const signedFieldNames = "total_amount,transaction_uuid,product_code";

      // eSewa v2 HMAC SHA256 signature calculation
      const signatureString = `total_amount=${formattedAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(signatureString)
        .digest("base64");

      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/esewa/verify`;
      const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}/pay?error=Payment Failed`;

      const formHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Redirecting to eSewa...</title>
      </head>
      <body>
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
          <h3>Redirecting to eSewa...</h3>
          <p>Please do not refresh or close this window.</p>
        </div>
        <form id="esewaForm" action="${paymentUrl}" method="POST">
          <input type="hidden" name="amount" value="${formattedAmount}" />
          <input type="hidden" name="tax_amount" value="0" />
          <input type="hidden" name="total_amount" value="${formattedAmount}" />
          <input type="hidden" name="transaction_uuid" value="${transactionUuid}" />
          <input type="hidden" name="product_code" value="${productCode}" />
          <input type="hidden" name="product_service_charge" value="0" />
          <input type="hidden" name="product_delivery_charge" value="0" />
          <input type="hidden" name="success_url" value="${successUrl}" />
          <input type="hidden" name="failure_url" value="${failureUrl}" />
          <input type="hidden" name="signed_field_names" value="${signedFieldNames}" />
          <input type="hidden" name="signature" value="${signature}" />
        </form>
        <script type="text/javascript">
          document.getElementById("esewaForm").submit();
        </script>
      </body>
      </html>
      `;

      return new NextResponse(formHtml, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // 3. KHALTI PAYMENT GATEWAY
    if (method === PaymentMethod.KHALTI) {
      const response = await fetch(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        {
          method: "POST",
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/khalti/callback`,
            website_url: process.env.NEXT_PUBLIC_APP_URL,
            amount: amountVal * 100, // Amount in paisa
            purchase_order_id: transactionUuid,
            purchase_order_name: booking.service.name,
            customer_info: {
              name: user.name ?? "Customer",
              email: user.email ?? "",
            },
          }),
        }
      );

      const khaltiData = await response.json();

      if (khaltiData.payment_url) {
        return NextResponse.redirect(khaltiData.payment_url, 303);
      }

      return NextResponse.redirect(
        new URL(
          `/dashboard/bookings/${booking.id}/pay?error=Failed to initiate Khalti payment`,
          req.url
        ),
        303
      );
    }

    return NextResponse.json(
      { error: "Unsupported payment method" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment Initiation Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}