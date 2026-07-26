import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params:{
      id:string
    }
  }
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


    const {id}=params;


    const body = await request.json();


    const existing =
    await prisma.serviceRequest.findUnique({

      where:{
        id
      }

    });


    if(!existing){

      return NextResponse.json(
        {
          error:"Request not found"
        },
        {
          status:404
        }
      );

    }


    if(existing.customerId !== user.id){

      return NextResponse.json(
        {
          error:"Forbidden"
        },
        {
          status:403
        }
      );

    }


    const updated =
    await prisma.serviceRequest.update({

      where:{
        id
      },

      data:{
        category:body.category,
        title:body.title,
        description:body.description,
        location:body.location,
        phone:body.phone,

        budget:
          body.budget
          ? Number(body.budget)
          : null,

        preferredDate:
          body.preferredDate
          ? new Date(body.preferredDate)
          : null,
      }

    });


    return NextResponse.json(updated);



  } catch(error:any){

    console.error(error);


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );

  }

}