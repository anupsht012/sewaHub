import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function PATCH(
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


        const { name, description, price } = await req.json();



        const provider = await prisma.provider.findUnique({
            where: {
                userId: user.id,
            },
        });


        if (!provider) {
            return NextResponse.json(
                { error: "Provider not found" },
                { status: 404 }
            );
        }



        const service = await prisma.service.findFirst({
            where: {
                id,
                providerId: provider.id,
            },
        });



        if (!service) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }



        const updated = await prisma.service.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                price: Number(price),
            },
        });



        return NextResponse.json(updated);


    } catch (error) {

        console.error("UPDATE SERVICE ERROR:", error);

        return NextResponse.json(
            { error: "Update failed" },
            { status: 500 }
        );

    }

}





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



        const provider = await prisma.provider.findUnique({
            where: {
                userId: user.id,
            },
        });



        if (!provider) {
            return NextResponse.json(
                { error: "Provider not found" },
                { status: 404 }
            );
        }



        const service = await prisma.service.findFirst({
            where: {
                id,
                providerId: provider.id,
            },
        });



        if (!service) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }



        await prisma.service.delete({
            where: {
                id,
            },
        });



        return NextResponse.json({
            success: true,
        });



    } catch (error) {

        console.error("DELETE SERVICE ERROR:", error);


        return NextResponse.json(
            {
                error: "Delete failed",
            },
            {
                status: 500,
            }
        );

    }

}