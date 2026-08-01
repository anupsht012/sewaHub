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



    const body = await request.json();


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
          error: "Please fill all required fields",
        },
        {
          status: 400,
        }
      );

    }





    // Create service request
    const serviceRequest =
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





    // Find providers who offer this category
    const providers = await prisma.provider.findMany({

      where: {

        services: {

          some: {

            category: category,

          },

        },

      },

      include: {

        user: true,

      },

    });





    // Send notification to matching providers
    if (providers.length > 0) {


      await prisma.notification.createMany({

        data: providers.map((provider) => ({

          userId: provider.user.id,

          title: "New Service Request",

          message:
            `New ${category} service request available in ${location}.`,

          type: "BOOKING_REQUEST",

          link:
            `/provider/requests/${serviceRequest.id}`,

        })),

      });


    }







    return NextResponse.json(

      {
        success: true,

        request: serviceRequest,

      }

    );





  } catch (error: any) {


    console.error(
      "REQUEST CREATE ERROR:",
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