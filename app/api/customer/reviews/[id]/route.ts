import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const { id } = await params;


    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });


    if (!review || review.customerId !== user.id) {

      return NextResponse.json(
        { error: "Not allowed" },
        { status: 403 }
      );

    }


    await prisma.review.delete({
      where: {
        id,
      },
    });


    return NextResponse.json({
      success: true,
    });


  } catch (error) {

    return NextResponse.json(
      {
        error: "Failed to delete review",
      },
      {
        status: 500,
      }
    );

  }

}