import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized - Please login to book" }, { status: 401 });
    }

    // Allow CUSTOMER role, or if role is null but not PROVIDER (for your current schema)
    if (user.role === "PROVIDER") {
      return NextResponse.json({ error: "Provider accounts cannot book services" }, { status: 403 });
    }

    const body = await req.json();
    const { serviceId, bookingDate, phone, address, note } = body;

    if (!serviceId || !bookingDate || !phone || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Server-side validation
    if (String(phone).replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Valid 10-digit phone number required" }, { status: 400 });
    }
    if (String(address).trim().length < 5) {
      return NextResponse.json({ error: "Valid address required (min 5 characters)" }, { status: 400 });
    }

    const parsedDate = new Date(bookingDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid booking date" }, { status: 400 });
    }
    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return NextResponse.json({ error: "Cannot book for past dates" }, { status: 400 });
    }

    // 1. Check service exists FIRST
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { provider: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Prevent booking own service if user is also a provider
    if (service.provider.userId === user.id) {
      return NextResponse.json({ error: "You cannot book your own service" }, { status: 400 });
    }

    // 2. Create booking after validation
    const booking = await prisma.booking.create({
      data: {
        customerId: user.id,
        serviceId,
        bookingDate: parsedDate,
        phone: String(phone).trim(),
        address: String(address).trim(),
        note: note ? String(note).trim().slice(0, 500) : null,
        status: "PENDING",
      },
    });

    // 3. Notify provider (don't fail booking if notification fails)
    try {
      await prisma.notification.create({
        data: {
          userId: service.provider.userId,
          title: "New Booking Request",
          message: `${user.name} booked your ${service.name} for ${parsedDate.toLocaleDateString()}`,
          type: "BOOKING_REQUEST",
          link: `/dashboard/provider/bookings/${booking.id}`,
        },
      });
    } catch (notifError) {
      console.error("NOTIFICATION ERROR:", notifError);
      // Don't block booking response
    }

    return NextResponse.json({ message: "Booking created", booking }, { status: 201 });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}