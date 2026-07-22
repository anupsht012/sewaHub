import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function PATCH(req: Request) {

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


    const { bio, location } = await req.json();


    const provider = await prisma.provider.update({
      where: {
        userId: user.id,
      },
      data: {
        bio,
        location,
      },
    });


    return NextResponse.json(provider);


  } catch (error) {

    console.error("PROVIDER UPDATE ERROR:", error);


    return NextResponse.json(
      {
        error: "Update failed",
      },
      {
        status: 500,
      }
    );

  }
}