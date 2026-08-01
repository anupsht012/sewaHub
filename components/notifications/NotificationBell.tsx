"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const loadNotifications = async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();

    setNotifications(data.notifications);
    setUnread(data.unread);
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer rounded-full p-2 hover:bg-gray-100"
      >
        <Bell className="h-6 w-6" />

        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          refresh={loadNotifications}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}