import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

// GET: Fetch all addresses for the logged-in user
export async function GET() {
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

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: [{ isDefault: "desc" }, { id: "desc" }],
        });

        return NextResponse.json({ addresses }, { status: 200 });
    } catch (error: any) {
        console.error("GET /api/user/address error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to fetch addresses" },
            { status: 500 }
        );
    }
}

// POST: Create a new address
export async function POST(request: Request) {
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

        const body = await request.json();
        const { label, province, district, city, area, street, landmark, isDefault } = body;

        if (!province || !district || !city) {
            return NextResponse.json(
                { error: "Missing required fields: province, district, and city are required." },
                { status: 400 }
            );
        }

        // If the new address is marked default, unset previous default addresses
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: session.user.id,
                label: label || null,
                province,
                district,
                city,
                area: area || null,
                street: street || null,
                landmark: landmark || null,
                isDefault: Boolean(isDefault),
            },
        });

        revalidatePath("/");

        return NextResponse.json(
            { message: "Address added successfully", address: newAddress },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("POST /api/user/address error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to create address" },
            { status: 500 }
        );
    }
}