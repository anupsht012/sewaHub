"use client";

import Link from "next/link";

interface Props {
  notifications: any[];
  refresh: () => void;
  close: () => void;
}

export default function NotificationDropdown({
  notifications,
  refresh,
  close,
}: Props) {
  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });

    refresh();
  };

  return (
    <div className="absolute right-0 mt-3 w-96 rounded-xl border bg-white shadow-xl z-50">
      <div className="border-b p-4 font-semibold">
        Notifications
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification: any) => (
            <Link
              key={notification.id}
              href={notification.link || "#"}
              onClick={() => {
                markAsRead(notification.id);
                close();
              }}
              className={`block border-b p-4 transition hover:bg-gray-50 ${
                !notification.isRead
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <div className="font-semibold">
                {notification.title}
              </div>

              <div className="mt-1 text-sm text-gray-600">
                {notification.message}
              </div>

              <div className="mt-2 text-xs text-gray-400">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}