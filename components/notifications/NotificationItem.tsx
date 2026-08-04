"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  closeDropdown: () => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  closeDropdown,
}: NotificationItemProps) {
  const router = useRouter();
  const [isMarking, setIsMarking] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const formattedDate = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const targetHref =
    notification.link && notification.link.trim() !== ""
      ? notification.link
      : "#";

  // Handle clicking the mark-as-read check button
  const handleMarkAsReadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsMarking(true);
    setIsFading(true);

    try {
      await onMarkAsRead(notification.id);
    } catch (error) {
      setIsFading(false);
      console.error(error);
    } finally {
      setIsMarking(false);
    }
  };

  // Handle clicking the notification item to read, fade out, vanish, and redirect
  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!notification.isRead) {
      setIsFading(true);
      onMarkAsRead(notification.id).catch((err) => console.error(err));
    }

    closeDropdown();

    if (targetHref !== "#") {
      router.push(targetHref);
    }
  };

  return (
    <Link
      href={targetHref}
      onClick={handleItemClick}
      className={`group relative flex items-start justify-between gap-3 p-4 cursor-pointer transition-all duration-300 ease-in-out ${
        isFading
          ? "opacity-0 -translate-x-4 max-h-0 py-0 overflow-hidden border-none"
          : "opacity-100 translate-x-0 max-h-[150px]"
      } ${
        !notification.isRead
          ? "bg-slate-50/80 hover:bg-slate-100/70"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      {/* Content Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold truncate ${
              !notification.isRead ? "text-slate-900" : "text-slate-700"
            }`}
          >
            {notification.title}
          </span>
          {!notification.isRead && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
          )}
        </div>

        <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
          {notification.message}
        </p>

        <p className="mt-2 text-[11px] font-medium text-slate-400">
          {formattedDate}
        </p>
      </div>

      {/* Mark as read button */}
      {!notification.isRead && (
        <button
          type="button"
          onClick={handleMarkAsReadClick}
          disabled={isMarking}
          title="Mark as read and remove"
          className="mt-0.5 p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors shrink-0 cursor-pointer z-10"
        >
          {isMarking ? (
            <Loader2 size={14} className="animate-spin text-slate-500" />
          ) : (
            <Check size={14} />
          )}
        </button>
      )}
    </Link>
  );
}