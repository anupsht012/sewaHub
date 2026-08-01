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


      // Approve application
      await tx.providerApplication.update({

        where: {
          id,
        },

        data: {
          status: "APPROVED",
        },

      });





      // Change user role
      await tx.user.update({

        where: {
          id: application.userId,
        },

        data: {
          role: "PROVIDER",
        },

      });






      // Create provider profile
      await tx.provider.create({

        data: {

          userId: application.userId,

          bio: application.description,

          location: application.location,

          verified: false,

        },

      });





      // Notify provider
      await tx.notification.create({

        data: {

          userId: application.userId,

          title:
            "Provider Application Approved",

          message:
            "Congratulations! Your provider application has been approved. You can now add services and receive bookings.",

          type:
            "SYSTEM_ALERT",

          link:
            "/provider/dashboard",

        },

      });


    });







    return NextResponse.json({

      success: true,

      message:
        "Provider approved successfully.",

    });





  } catch (error) {


    console.error(
      "PROVIDER APPROVE ERROR:",
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