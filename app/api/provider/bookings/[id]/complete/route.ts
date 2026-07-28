import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id:string;
    }>;
  }
) {


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



  const {id} = await params;



  const provider = await prisma.provider.findUnique({

    where:{
      userId:user.id,
    },

  });



  if(!provider){

    return NextResponse.json(
      {
        error:"Provider not found"
      },
      {
        status:404
      }
    );

  }




  const booking = await prisma.booking.findFirst({

    where:{

      id,

      service:{
        providerId:provider.id,
      },

    },

  });



  if(!booking){

    return NextResponse.json(
      {
        error:"Booking not found"
      },
      {
        status:404
      }
    );

  }




  if(booking.status !== "ACCEPTED"){

    return NextResponse.json(
      {
        error:"Only accepted bookings can be completed"
      },
      {
        status:400
      }
    );

  }




  const updated = await prisma.booking.update({

    where:{
      id,
    },

    data:{
      status:"COMPLETED",
    },

  });



  return NextResponse.json(updated);

}