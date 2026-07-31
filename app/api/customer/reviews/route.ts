import { getCurrentUser } from "@/lib/auth/get-user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceRequest } from "@/lib/generated/prisma/client";


export async function POST(req: Request) {

  try {

    const user = await getCurrentUser();


    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized access",
        },
        {
          status: 401,
        }
      );

    }



    const body = await req.json();

    const {
      serviceId,
      rating,
      comment,
    } = body;




    console.log("REVIEW REQUEST:", {
      userId: user.id,
      serviceId,
      rating,
      comment,
    });





    if (!serviceId || !rating) {

      return NextResponse.json(
        {
          error:
            "Service ID and Rating are required",
        },
        {
          status: 400,
        }
      );

    }





    // 1. Check completed booking
    const completedBooking =
      await prisma.booking.findFirst({

        where: {

          customerId: user.id,

          serviceId,

          status: "COMPLETED",

        },

      });





    // 2. Check completed service request
    let completedRequest: ServiceRequest | null = null;


    if (!completedBooking) {


      const service =
        await prisma.service.findUnique({

          where: {
            id: serviceId,
          },

          select: {

            providerId: true,

          },

        });




      if (service) {

        completedRequest =
          await prisma.serviceRequest.findFirst({

            where: {

              customerId: user.id,

              providerId: service.providerId,

              status: "COMPLETED",

            },

          });

      }

    }





    console.log("CHECK RESULT:", {

      hasCompletedBooking:
        !!completedBooking,

      hasCompletedRequest:
        !!completedRequest,

    });






    if (!completedBooking && !completedRequest) {

      return NextResponse.json(

        {
          error:
            "You can only review services from completed bookings or requests.",
        },

        {
          status: 403,
        }

      );

    }






    // 3. Check existing review
    const existingReview =
      await prisma.review.findUnique({

        where: {

          customerId_serviceId: {

            customerId: user.id,

            serviceId,

          },

        },

      });





    if (existingReview) {

      return NextResponse.json(

        {
          error:
            "You have already submitted a review for this service.",
        },

        {
          status: 400,
        }

      );

    }






    // 4. Create review
    const review =
      await prisma.review.create({

        data: {

          customerId: user.id,

          serviceId,

          rating: Number(rating),

          comment,

        },

      });







    // 5. Get provider user id for notification
    const service =
      await prisma.service.findUnique({

        where: {

          id: serviceId,

        },

        select: {

          provider: {

            select: {

              userId: true,

            },

          },

        },

      });







    // 6. Notify provider about new review
    if (service?.provider?.userId) {


      await prisma.notification.create({

        data: {

          userId:
            service.provider.userId,


          title:
            "New Review Received",


          message:
            `Customer gave you a ${rating} star review.`,


          type:
            "SYSTEM_ALERT",


          link:
            `/provider/services/${serviceId}/reviews`,


        },

      });


    }








    return NextResponse.json(

      {

        message:
          "Review created successfully",


        review,

      },

      {

        status: 201,

      }

    );





  } catch (error) {


    console.error(
      "REVIEW_SUBMIT_ERROR:",
      error
    );



    return NextResponse.json(

      {
        error:
          "Internal Server Error",
      },

      {

        status: 500,

      }

    );


  }

}