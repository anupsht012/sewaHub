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
        { error: "Only customers can book services" },
        { status: 403 }
      );
    }


    const body = await req.json();


    const {
      serviceId,
      bookingDate,
      phone,
      address,
      note,
    } = body;


    if (!serviceId || !bookingDate || !phone || !address) {

      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    }


    const booking = await prisma.booking.create({

      data: {

        customerId: user.id,

        serviceId,

        bookingDate: new Date(bookingDate),

        phone,

        address,

        note,

      },

    });


    return NextResponse.json(
      {
        message: "Booking created",
        booking,
      },
      { status: 201 }
    );


  } catch (error) {

    console.error("BOOKING ERROR:", error);


    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );

  }

}