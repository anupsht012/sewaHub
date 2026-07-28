import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


interface Props {
  params: Promise<{
    id:string;
  }>;
}



export async function PATCH(
  req:Request,
  {params}:Props
){

  try {


    const user = await getCurrentUser();



    if(!user){

      return NextResponse.json(
        {
          error:"Unauthorized"
        },
        {
          status:401
        }
      );

    }



    if(user.role !== "ADMIN"){

      return NextResponse.json(
        {
          error:"Forbidden"
        },
        {
          status:403
        }
      );

    }



    const {id}=await params;



    const body = await req.json();



    const allowedStatuses = [
      "PENDING",
      "ACCEPTED",
      "REJECTED",
      "CANCELLED",
      "COMPLETED",
    ];



    if(
      !allowedStatuses.includes(body.status)
    ){

      return NextResponse.json(
        {
          error:"Invalid status"
        },
        {
          status:400
        }
      );

    }




    const booking =
      await prisma.booking.update({

        where:{
          id,
        },


        data:{
          status:body.status,
        },

      });





    return NextResponse.json({
      success:true,
      booking,
    });



  } catch(error){


    console.error(error);


    return NextResponse.json(
      {
        error:"Something went wrong"
      },
      {
        status:500
      }
    );

  }

}