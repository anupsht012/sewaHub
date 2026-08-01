import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const user = await getCurrentUser();


    if (!user) {

      return NextResponse.redirect(
        new URL("/login", request.url)
      );

    }



    const { id } = await params;



    const serviceRequest =
      await prisma.serviceRequest.findUnique({

        where: {
          id,
        },

        include: {

          provider: {
            include: {
              user: true,
            },
          },

          offers: {
            include: {
              provider: {
                include: {
                  user: true,
                },
              },
            },
          },

        },

      });





    if (!serviceRequest) {

      return NextResponse.json(
        {
          error: "Request not found",
        },
        {
          status: 404,
        }
      );

    }





    if (serviceRequest.customerId !== user.id) {

      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );

    }






    await prisma.serviceRequest.update({

      where: {
        id,
      },

      data: {
        status: "CANCELLED",
      },

    });





    // Collect providers who need notification
    const providerUserIds = new Set<string>();


    // Assigned provider
    if (serviceRequest.provider?.user.id) {

      providerUserIds.add(
        serviceRequest.provider.user.id
      );

    }



    // Providers who sent offers
    serviceRequest.offers.forEach((offer) => {

      providerUserIds.add(
        offer.provider.user.id
      );

    });





    // Create cancellation notifications
    if (providerUserIds.size > 0) {

      await prisma.notification.createMany({

        data: Array.from(providerUserIds).map(
          (userId) => ({

            userId,

            title:
              "Service Request Cancelled",

            message:
              "Customer cancelled the service request.",

            type:
              "BOOKING_CANCELLED",

            link:
              `/provider/requests/${serviceRequest.id}`,

          })
        ),

      });

    }





    return NextResponse.redirect(

      new URL(
        "/dashboard/requests",
        request.url
      )

    );


  } catch (error) {

    console.error(
      "CANCEL REQUEST ERROR:",
      error
    );


    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }

}