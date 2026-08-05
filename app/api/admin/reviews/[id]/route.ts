import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const user = await getCurrentUser();


    if (!user || user.role !== "ADMIN") {

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    }


    const { id } = await params;


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