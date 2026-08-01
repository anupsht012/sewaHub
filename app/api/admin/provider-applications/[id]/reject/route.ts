import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}


export async function PATCH(
  req: Request,
  { params }: RouteContext
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





    if (user.role !== "ADMIN") {

      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );

    }





    const { id } = await params;





    const application =
      await prisma.providerApplication.findUnique({

        where: {
          id,
        },

      });





    if (!application) {

      return NextResponse.json(
        {
          error: "Application not found",
        },
        {
          status: 404,
        }
      );

    }





    await prisma.$transaction(async (tx) => {



      // Reject application
      await tx.providerApplication.update({

        where: {
          id,
        },

        data: {
          status: "REJECTED",
        },

      });






      // Notify applicant
      await tx.notification.create({

        data: {

          userId:
            application.userId,


          title:
            "Provider Application Rejected",


          message:
            "Your provider application has been rejected. Please review your information and apply again.",


          type:
            "SYSTEM_ALERT",


          link:
            "/provider/apply",

        },

      });


    });







    return NextResponse.json({

      success: true,

      message:
        "Application rejected.",

    });






  } catch (error) {


    console.error(
      "PROVIDER REJECT ERROR:",
      error
    );



    return NextResponse.json(

      {
        error:
          "Something went wrong.",
      },

      {
        status:500,
      }

    );


  }

}