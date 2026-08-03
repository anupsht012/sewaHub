import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(req: Request) {

  try {


    const user = await getCurrentUser();



    if (!user) {

      return NextResponse.json(
        {
          error:"Unauthorized",
        },
        {
          status:401,
        }
      );

    }




    if(user.role !== "PROVIDER"){

      return NextResponse.json(
        {
          error:
          "Only providers can create services",
        },
        {
          status:403,
        }
      );

    }





    const {
      name,
      description,
      price,
    } = await req.json();





    if(
      !name ||
      !price
    ){

      return NextResponse.json(
        {
          error:
          "Name and price are required",
        },
        {
          status:400,
        }
      );

    }







    const provider =
      await prisma.provider.findUnique({

        where:{
          userId:user.id,
        },

      });







    if(!provider){

      return NextResponse.json(
        {
          error:
          "Provider profile not found",
        },
        {
          status:404,
        }
      );

    }








    const service =
      await prisma.service.create({

        data:{


          name,


          // Automatically from provider

          category:
            provider.category,



          description:
            description || null,



          price:
            Number(price),



          providerId:
            provider.id,


        },

      });










    // Notify admins

    const admins =
      await prisma.user.findMany({

        where:{
          role:"ADMIN",
        },

      });





    if(admins.length > 0){


      await prisma.notification.createMany({

        data:

          admins.map((admin)=>({

            userId:
              admin.id,


            title:
              "New Service Created",


            message:
              `${user.name} created a new service: ${service.name}`,



            type:
              "SERVICE_CREATED",



            link:
              `/admin/services/${service.id}`,

          })),

      });


    }







    return NextResponse.json(

      {
        success:true,
        service,
      },

      {
        status:201,
      }

    );





  } catch(error){


    console.error(
      "CREATE SERVICE ERROR:",
      error
    );



    return NextResponse.json(
      {
        error:
        "Something went wrong",
      },
      {
        status:500,
      }
    );


  }

}