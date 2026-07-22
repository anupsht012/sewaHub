import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(req: Request) {

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
          error: "Only providers can create services",
        },
        {
          status: 403,
        }
      );
    }


    const { name, description, price } = await req.json();



    if (!name || !price) {
      return NextResponse.json(
        {
          error: "Name and price are required",
        },
        {
          status: 400,
        }
      );
    }



    const provider = await prisma.provider.findUnique({
      where: {
        userId: user.id,
      },
    });



    if (!provider) {
      return NextResponse.json(
        {
          error: "Provider profile not found",
        },
        {
          status: 404,
        }
      );
    }



    const service = await prisma.service.create({
      data: {

        name,

        description,

        price: Number(price),

        providerId: provider.id,

      },
    });



    return NextResponse.json(
      {
        success: true,
        service,
      },
      {
        status: 201,
      }
    );


  } catch (error) {

    console.error("CREATE SERVICE ERROR:", error);


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