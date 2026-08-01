import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionUuid = searchParams.get("txn");

    if (!transactionUuid) {
      return NextResponse.json({ error: "Missing transaction UUID" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: { transactionUuid },
      include: {
        booking: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const merchantCode = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
    const secretKey = process.env.ESEWA_SECRET_KEY || "8gA21AjA3BD8rAaA";
    const totalAmount = payment.amount.toString();
    const productCode = merchantCode;

    // eSewa v2 Signature string: total_amount,transaction_uuid,product_code
    const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureString)
      .digest("base64");

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/esewa/callback`;
    const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${payment.bookingId}/pay?error=Payment failed or cancelled`;

    const htmlForm = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to eSewa...</title>
        </head>
        <body onload="document.forms['esewaForm'].submit();">
          <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h3>Redirecting to eSewa Payment Gateway...</h3>
            <p>Please do not refresh or close this window.</p>
          </div>
          <form id="esewaForm" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <input type="hidden" name="amount" value="${totalAmount}" required>
            <input type="hidden" name="tax_amount" value="0" required>
            <input type="hidden" name="total_amount" value="${totalAmount}" required>
            <input type="hidden" name="transaction_uuid" value="${transactionUuid}" required>
            <input type="hidden" name="product_code" value="${productCode}" required>
            <input type="hidden" name="product_service_charge" value="0" required>
            <input type="hidden" name="product_delivery_charge" value="0" required>
            <input type="hidden" name="success_url" value="${successUrl}" required>
            <input type="hidden" name="failure_url" value="${failureUrl}" required>
            <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
            <input type="hidden" name="signature" value="${signature}" required>
          </form>
        </body>
      </html>
    `;

    return new NextResponse(htmlForm, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("eSewa Redirect Error:", error);
    return NextResponse.json({ error: "Failed to generate eSewa form" }, { status: 500 });
  }
}