import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@/lib/generated/prisma/enums";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dataParam = searchParams.get("data");

        if (!dataParam) {
            return NextResponse.redirect(
                new URL("/dashboard/bookings?error=Invalid response from eSewa", req.url)
            );
        }

        // Decode base64 response from eSewa
        const decodedData = JSON.parse(
            Buffer.from(dataParam, "base64").toString("utf-8")
        );

        const { transaction_uuid, status } = decodedData;

        const payment = await prisma.payment.findFirst({
            where: { transactionUuid: transaction_uuid },
        });

        if (!payment) {
            return NextResponse.redirect(
                new URL("/dashboard/bookings?error=Transaction not found", req.url)
            );
        }

        if (status === "COMPLETE") {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: PaymentStatus.SUCCESS },
            });

            await prisma.booking.update({
                where: { id: payment.bookingId },
                data: { status: BookingStatus.ACCEPTED },
            });

            return NextResponse.redirect(
                new URL(
                    `/dashboard/bookings/${payment.bookingId}/pay?success=Payment complete`,
                    req.url
                )
            );
        }

        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.FAILED },
        });

        return NextResponse.redirect(
            new URL(
                `/dashboard/bookings/${payment.bookingId}/pay?error=Payment failed`,
                req.url
            )
        );
    } catch (error) {
        console.error("eSewa Verification Error:", error);
        return NextResponse.redirect(
            new URL("/dashboard/bookings?error=Verification failed", req.url)
        );
    }
}