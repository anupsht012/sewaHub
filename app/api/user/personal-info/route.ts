import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export async function PATCH(request: Request) {
    try {
        // 1. Get authenticated session using Better Auth
        const requestHeaders = await headers();
        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized access: No active session" },
                { status: 401 }
            );
        }

        // 2. Parse request payload
        const body = await request.json();
        const { name, phone, gender, dateOfBirth, bio } = body;

        // 3. Update database record in PostgreSQL via Prisma
        const updatedUser = await prisma.user.update({
            where: { 
                email: session.user.email 
            },
            data: {
                ...(name && { name }),
                phone: phone ? phone : null,
                gender: gender ? gender : null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                bio: bio ? bio : null,
            },
        });

        // 4. Invalidate server cache
        revalidatePath("/");

        return NextResponse.json(
            { 
                message: "Personal information updated successfully", 
                user: updatedUser 
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("DETAILED SERVER ERROR IN /api/user/personal-info:", error);

        return NextResponse.json(
            { error: error?.message || "Failed to update database record" },
            { status: 500 }
        );
    }
}