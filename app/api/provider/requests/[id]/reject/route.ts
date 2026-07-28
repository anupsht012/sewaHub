import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
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




    if (user.role !== "PROVIDER") {

      return NextResponse.json(
        {
          error: "Only providers can reject requests",
        },
        {
          status:403,
        }
      );

    }





    const { id } = await context.params;





    const provider = await prisma.provider.findUnique({

      where:{
        userId:user.id,
      },

    });





    if(!provider){

      return NextResponse.json(
        {
          error:"Provider profile not found",
        },
        {
          status:404,
        }
      );

    }







    const request =
      await prisma.serviceRequest.findUnique({

        where:{
          id,
        },

      });






    if(!request){

      return NextResponse.json(
        {
          error:"Service request not found",
        },
        {
          status:404,
        }
      );

    }







    if(request.status !== "OPEN"){

      return NextResponse.json(
        {
          error:"Request already processed",
        },
        {
          status:400,
        }
      );

    }







    const updatedRequest =
      await prisma.serviceRequest.update({

        where:{
          id,
        },


        data:{

          status:"CANCELLED",

        },


      });







    return NextResponse.json({

      success:true,

      request:updatedRequest,

    });





  } catch(error){


    console.error(
      "REJECT REQUEST ERROR:",
      error
    );



    return NextResponse.json(
      {
        error:"Something went wrong",
      },
      {
        status:500,
      }
    );


  }

}