import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

// PATCH: Update an existing address
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const requestHeaders = await headers();
        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Await params to access id in Next.js 15+
        const { id: addressId } = await params;

        if (!addressId) {
            return NextResponse.json(
                { error: "Address ID is missing" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { label, province, district, city, area, street, landmark, isDefault } = body;

        // Verify that address exists and belongs to this user
        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!existingAddress || existingAddress.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Address not found or unauthorized" },
                { status: 404 }
            );
        }

        // If setting this address to default, unset other default addresses for user
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id, isDefault: true, NOT: { id: addressId } },
                data: { isDefault: false },
            });
        }

        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: {
                label: label !== undefined ? label : existingAddress.label,
                province: province !== undefined ? province : existingAddress.province,
                district: district !== undefined ? district : existingAddress.district,
                city: city !== undefined ? city : existingAddress.city,
                area: area !== undefined ? area : existingAddress.area,
                street: street !== undefined ? street : existingAddress.street,
                landmark: landmark !== undefined ? landmark : existingAddress.landmark,
                isDefault: isDefault !== undefined ? Boolean(isDefault) : existingAddress.isDefault,
            },
        });

        revalidatePath("/");

        return NextResponse.json(
            { message: "Address updated successfully", address: updatedAddress },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("PATCH /api/user/address/[id] error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to update address" },
            { status: 500 }
        );
    }
}

// DELETE: Delete an address
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const requestHeaders = await headers();
        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Await params to access id in Next.js 15+
        const { id: addressId } = await params;

        if (!addressId) {
            return NextResponse.json(
                { error: "Address ID is missing" },
                { status: 400 }
            );
        }

        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!existingAddress || existingAddress.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Address not found or unauthorized" },
                { status: 404 }
            );
        }

        await prisma.address.delete({
            where: { id: addressId },
        });

        revalidatePath("/");

        return NextResponse.json(
            { message: "Address deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("DELETE /api/user/address/[id] error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to delete address" },
            { status: 500 }
        );
    }
}