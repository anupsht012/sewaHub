import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { PaymentStatus, BookingStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only Admin" }, { status: 403 });
  }

  const formData = await req.formData();
  const paymentId = formData.get("paymentId")?.toString();
  const action = formData.get("action")?.toString();

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { 
      booking: { 
        include: { 
          service: { include: { provider: { include: { user: true } } } },
          customer: true
        } 
      } 
    },
  });

  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "APPROVE") {
    await prisma.$transaction([
      prisma.payment.update({ where: { id: paymentId }, data: { status: PaymentStatus.SUCCESS } }),
      prisma.booking.update({ where: { id: payment.bookingId }, data: { status: BookingStatus.ACCEPTED } }),
    ]);
  } else {
    await prisma.payment.update({ where: { id: paymentId }, data: { status: PaymentStatus.FAILED } });
  }

  // FIX: Always redirect, never JSON
  return NextResponse.redirect(new URL(`/admin/payments?status=PENDING`, req.url), { status: 303 });
}