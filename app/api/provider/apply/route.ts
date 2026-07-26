import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(
  request: Request
) {

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



    if (user.role === "PROVIDER") {

      return NextResponse.json(
        {
          error: "You are already a provider",
        },
        {
          status: 400,
        }
      );

    }




    const existingApplication =
      await prisma.providerApplication.findFirst({

        where: {

          userId: user.id,

          status: "PENDING",

        },

      });





    if (existingApplication) {

      return NextResponse.json(
        {
          error: "Application already submitted",
        },
        {
          status: 400,
        }
      );

    }






    const body = await request.json();



    const {
      businessName,
      category,
      description,
      location,
      phone,
    } = body;





    if (
      !businessName ||
      !category ||
      !description ||
      !location ||
      !phone
    ) {

      return NextResponse.json(
        {
          error: "Please fill all fields",
        },
        {
          status: 400,
        }
      );

    }







    const application =
      await prisma.providerApplication.create({

        data: {

          userId: user.id,

          businessName,

          category,

          description,

          location,

          phone,

        },

      });







    return NextResponse.json(
      {
        success: true,
        application,
      }
    );



  } catch(error:any) {


    console.error(
      "PROVIDER APPLICATION ERROR:",
      error
    );



    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong",
      },
      {
        status: 500,
      }
    );


  }

}