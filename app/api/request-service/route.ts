import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(
  req: Request
) {

  try {

    const user = await getCurrentUser();


    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized"
        },
        {
          status: 401
        }
      );

    }



    if (user.role !== "CUSTOMER") {

      return NextResponse.json(
        {
          error:
          "Only customers can create requests"
        },
        {
          status: 403
        }
      );

    }



    const body = await req.json();


    const {
      category,
      title,
      description,
      location,
      phone,
      budget,
      preferredDate,
    } = body;



    if (
      !category ||
      !title ||
      !description ||
      !location ||
      !phone
    ) {

      return NextResponse.json(
        {
          error:
          "Please fill all required fields"
        },
        {
          status: 400
        }
      );

    }



    const request =
      await prisma.serviceRequest.create({

        data: {

          customerId: user.id,

          category,

          title,

          description,

          location,

          phone,


          budget:
            budget
            ? Number(budget)
            : null,


          preferredDate:
            preferredDate
            ? new Date(preferredDate)
            : null,


        },

      });



    return NextResponse.json(
      {
        success:true,
        request,
      },
      {
        status:201
      }
    );



  } catch(error) {


    console.error(
      "REQUEST SERVICE ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
        "Internal server error"
      },
      {
        status:500
      }
    );


  }

}
