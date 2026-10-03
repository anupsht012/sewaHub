import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const bookingId = formData.get("bookingId")?.toString();
    const method = formData.get("method")?.toString() as PaymentMethod;
    
    let proofImageUrl = formData.get("proofImageUrl")?.toString();
    const file = (formData.get("proof") as File) || (formData.get("file") as File);

    if (file && !proofImageUrl) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      if (buffer.length > 2_000_000) {
        return NextResponse.json({ error: "Image too large, max 2MB" }, { status: 400 });
      }
      proofImageUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    if (!bookingId || !method || !proofImageUrl) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: { include: { provider: { include: { user: true } } } } },
    });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const amount = booking.service.price;

    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: { method, status: PaymentStatus.PENDING, proofImageUrl, amount },
      create: {
        bookingId,
        amount,
        method,
        status: PaymentStatus.PENDING,
        proofImageUrl,
        transactionUuid: `MANUAL-${Date.now()}-${bookingId.slice(0,5)}`,
      },
    });

    // FIXED FOR ADMIN QR: Notify ADMIN, not provider
    try {
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (admin) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "New Manual Payment to Verify",
            message: `${user.name} paid Rs.${amount} for ${booking.service.name} - Check /admin/payments`,
            type: "BOOKING_UPDATE" as any,
            link: `/admin/payments`,
          },
        });
      }
    } catch (e) {
      console.log("Admin notify failed", e);
    }

    // Return JSON for your ManualQRForm fetch handler
    return NextResponse.json({ 
      success: true, 
      message: "Proof submitted",
      redirect: `/dashboard/bookings/${booking.id}/pay?success=Proof submitted! Admin will verify shortly`
    });

  } catch (err: any) {
    console.error("MANUAL PAY ERROR:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}