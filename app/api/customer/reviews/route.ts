import { getCurrentUser } from '@/lib/auth/get-user';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceRequest } from '@/lib/generated/prisma/client';


export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { serviceId, rating, comment } = body;

    console.log("REVIEW REQUEST:", {
      userId: user.id,
      serviceId,
      rating,
      comment,
    });

    if (!serviceId || !rating) {
      return NextResponse.json(
        { error: "Service ID and Rating are required" },
        { status: 400 }
      );
    }

    // 1. Check for a direct completed Booking
    const completedBooking = await prisma.booking.findFirst({
      where: {
        customerId: user.id,
        serviceId,
        status: "COMPLETED",
      },
    });

    // 2. If no direct booking, check if the service belongs to a completed ServiceRequest
    let completedRequest: ServiceRequest | null = null;
    if (!completedBooking) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { providerId: true },
      });

      if (service) {
        completedRequest = await prisma.serviceRequest.findFirst({
          where: {
            customerId: user.id,
            providerId: service.providerId,
            status: "COMPLETED",
          },
        });
      }
    }

    console.log("CHECK RESULT:", {
      hasCompletedBooking: !!completedBooking,
      hasCompletedRequest: !!completedRequest,
    });

    if (!completedBooking && !completedRequest) {
      return NextResponse.json(
        { error: "You can only review services from completed bookings or requests." },
        { status: 403 }
      );
    }

    // 3. Check if a review already exists (enforced by @@unique([customerId, serviceId]))
    const existingReview = await prisma.review.findUnique({
      where: {
        customerId_serviceId: {
          customerId: user.id,
          serviceId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already submitted a review for this service." },
        { status: 400 }
      );
    }

    // 4. Create the review
    const review = await prisma.review.create({
      data: {
        customerId: user.id,
        serviceId,
        rating: Number(rating),
        comment,
      },
    });

    return NextResponse.json(
      { message: "Review created successfully", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("REVIEW_SUBMIT_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}