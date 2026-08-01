import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function GET() {

  try {

    const user = await getCurrentUser();


    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }



    if (user.role !== "PROVIDER") {

      return NextResponse.json(
        {
          error: "Only providers allowed",
        },
        {
          status: 403,
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
          error: "Provider profile not found",
        },
        {
          status: 404,
        }
      );

    }



    console.log(
      "PROVIDER ID:",
      provider.id
    );



    const bookings = await prisma.booking.findMany({

      where: {

        service: {
          providerId: provider.id,
        },

      },


      include: {

        customer: {

          select: {

            name: true,

            email: true,

            image: true,

          },

        },


        service: {

          select: {

            name: true,

            price: true,

          },

        },


        // Added payment relation
        payment: true,

      },


      orderBy: {

        createdAt: "desc",

      },

    });





    return NextResponse.json(bookings);



  } catch (error) {


    console.error(
      "PROVIDER BOOKINGS ERROR:",
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