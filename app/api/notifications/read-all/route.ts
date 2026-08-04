import { NextResponse } from "next/server";

export async function PATCH() {
  try {
    // TODO: Update all notifications for current user in database
    // e.g., await db.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to mark all as read" },
      { status: 500 }
    );
  }
}