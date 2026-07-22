import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(req: Request) {

  try {

    const user = await getCurrentUser();


    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customers can review services" },
        { status: 403 }
      );
    }


    const body = await req.json();


    const {
      serviceId,
      rating,
      comment,
    } = body;



    if (!serviceId || !rating) {

      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    }



    if (rating < 1 || rating > 5) {

      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );

    }



    const completedBooking =
      await prisma.booking.findFirst({

        where: {

          customerId: user.id,

          serviceId,

          status: "COMPLETED",

        },

      });



    if (!completedBooking) {

      return NextResponse.json(
        {
          error:
            "You can only review completed bookings",
        },
        {
          status: 403,
        }
      );

    }



    const existingReview =
      await prisma.review.findFirst({

        where: {

          customerId: user.id,

          serviceId,

        },

      });



    if (existingReview) {

      return NextResponse.json(
        {
          error:
            "You already reviewed this service",
        },
        {
          status: 400,
        }
      );

    }



    const review = await prisma.review.create({

      data: {

        customerId: user.id,

        serviceId,

        rating,

        comment,

      },

    });



    return NextResponse.json(
      {
        message: "Review submitted",
        review,
      },
      {
        status: 201,
      }
    );



  } catch(error) {

    console.error("REVIEW ERROR:", error);


    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status:500,
      }
    );

  }

}