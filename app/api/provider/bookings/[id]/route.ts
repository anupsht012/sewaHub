import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


console.log("BOOKING PATCH ROUTE LOADED");


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {


    const user = await getCurrentUser();


    if (!user || user.role !== "PROVIDER") {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }



    const { id } = await params;



    const body = await req.json();


    const { status } = body;



    if (
      ![
        "ACCEPTED",
        "REJECTED",
        "COMPLETED",
      ].includes(status)
    ) {

      return NextResponse.json(
        {
          error: "Invalid status",
        },
        {
          status: 400,
        }
      );

    }




    const provider = await prisma.provider.findUnique({

      where: {
        userId: user.id,
      },

    });



    if (!provider) {

      return NextResponse.json(
        {
          error: "Provider not found",
        },
        {
          status: 404,
        }
      );

    }




    const booking = await prisma.booking.findFirst({

      where: {

        id,

        service: {

          providerId: provider.id,

        },

      },

    });





    if (!booking) {

      return NextResponse.json(
        {
          error: "Booking not found",
        },
        {
          status: 404,
        }
      );

    }





    const updated = await prisma.booking.update({

      where: {

        id,

      },

      data: {

        status,

      },

    });





    return NextResponse.json(updated);



  } catch (error) {


    console.error(
      "UPDATE BOOKING ERROR:",
      error
    );


    return NextResponse.json(

      {
        error: "Server error",
      },

      {
        status: 500,
      }

    );


  }

}