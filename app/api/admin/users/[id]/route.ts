import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


interface Props {
  params: Promise<{
    id:string;
  }>;
}



export async function DELETE(
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



    const targetUser =
      await prisma.user.findUnique({

        where:{
          id,
        }

      });



    if(!targetUser){

      return NextResponse.json(
        {
          error:"User not found"
        },
        {
          status:404
        }
      );

    }




    if(targetUser.role==="ADMIN"){

      return NextResponse.json(
        {
          error:"Cannot delete admin"
        },
        {
          status:400
        }
      );

    }





    await prisma.user.delete({

      where:{
        id,
      }

    });




    return NextResponse.json({

      success:true,

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