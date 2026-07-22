import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      name,
      email,
      subject,
      message,
    } = body;


    if (!name || !email || !subject || !message) {

      return NextResponse.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        }
      );

    }


    const contact = await prisma.contactMessage.create({

      data: {
        name,
        email,
        subject,
        message,
      },

    });


    return NextResponse.json(contact);


  } catch(error) {

    console.error(
      "CONTACT ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:"Server error",
      },
      {
        status:500,
      }
    );

  }

}