import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { NotificationType } from "@/lib/generated/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role!== "PROVIDER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();
  if (!["ACCEPTED", "REJECTED", "COMPLETED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { service: { include: { provider: true } }, payment: true },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.service.provider.userId!== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (status === "COMPLETED" && booking.payment?.status!== "SUCCESS") {
    return NextResponse.json(
      { error: "Payment must be successful before completing" },
      { status: 400 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { status },
  });

  // Map booking status to YOUR enum - no schema change needed
  const typeMap: Record<string, NotificationType> = {
    ACCEPTED: "BOOKING_ACCEPTED",
    REJECTED: "BOOKING_REJECTED",
    COMPLETED: "BOOKING_COMPLETED",
  };

  await prisma.notification.create({
    data: {
      userId: booking.customerId,
      title: `Booking ${status}`,
      message: `Your booking for ${booking.service.name} is now ${status.toLowerCase()}`,
      type: typeMap[status], // <-- uses existing enum values
      link: `/bookings`,
    },
  });

  return NextResponse.json(updated);
}