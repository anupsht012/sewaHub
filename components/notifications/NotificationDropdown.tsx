"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import NotificationItem, { Notification } from "./NotificationItem";

interface NotificationDropdownProps {
  notifications: Notification[];
  refresh: () => void;
  close: () => void;
}

export default function NotificationDropdown({
  notifications = [],
  refresh,
  close,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [localNotifications, setLocalNotifications] =
    useState<Notification[]>(notifications);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Sync prop updates into local state when parent props update
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter((n) => !n.isRead).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  // Handler passed to each NotificationItem
  const handleMarkAsRead = async (id: string) => {
    // Immediately trigger removal from state after transition duration (300ms)
    setTimeout(() => {
      setLocalNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 300);

    const res = await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });

    if (!res.ok) {
      // Revert state back if API request fails
      setLocalNotifications(notifications);
      throw new Error("Failed to mark as read");
    }

    refresh();
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    setIsMarkingAll(true);

    // Optimistically clear all unread items from UI
    setLocalNotifications((prev) => prev.filter((item) => item.isRead));

    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      if (!res.ok) {
        setLocalNotifications(notifications);
      } else {
        refresh();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      setLocalNotifications(notifications);
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={isMarkingAll}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {isMarkingAll ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <CheckCheck size={14} />
            )}
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
        {localNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
              <Bell size={18} />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              No notifications
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              You're all caught up!
            </p>
          </div>
        ) : (
          localNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              closeDropdown={close}
            />
          ))
        )}
      </div>
    </div>
  );
}