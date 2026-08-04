"use client";

import {
  CalendarDays,
  CreditCard,
  Bell,
  CheckCircle2,
  UserRound,
  XCircle,
  AlertCircle,
  Wrench,
} from "lucide-react";

export type ActivityType =
  | "BOOKING_REQUEST"
  | "BOOKING_ACCEPTED"
  | "BOOKING_REJECTED"
  | "BOOKING_COMPLETED"
  | "BOOKING_CANCELLED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "SYSTEM_ALERT"
  | "PROVIDER_APPLICATION"
  | "SERVICE_CREATED"
  | "SERVICE_UPDATED"
  | "SERVICE_DELETED";

export interface ActivityItem {
  id: string;
  title: string;
  message: string;
  type: ActivityType;
  createdAt: Date | string;
  isRead: boolean;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxHeight?: string; // Optional custom height for scroll container
}

export default function RecentActivity({
  activities = [],
  maxHeight = "max-h-[480px]",
}: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Recent Activity
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Latest updates and notifications across your account
          </p>
        </div>

        {activities.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {activities.length} {activities.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {/* Activity List Container */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-2">
            <Bell size={20} />
          </div>
          <p className="text-sm font-medium text-slate-600">No activity yet</p>
          <p className="text-xs text-slate-400 mt-0.5">
            When actions take place, they will appear here.
          </p>
        </div>
      ) : (
        /* Scrollable Container for high volume of activities */
        <div
          className={`${maxHeight} overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent`}
        >
          {activities.map((activity) => {
            const formattedDate = activity.createdAt
              ? new Date(activity.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={activity.id}
                className={`relative flex items-start gap-3.5 rounded-xl border p-4 transition-colors ${
                  activity.isRead
                    ? "border-slate-100 bg-white"
                    : "border-slate-200 bg-slate-50/60"
                }`}
              >
                {/* Activity Icon Box */}
                <div className="shrink-0 pt-0.5">
                  <ActivityIcon type={activity.type} />
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {activity.title}
                    </h3>

                    {/* Unread Indicator */}
                    {!activity.isRead && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-indigo-600"
                        title="Unread notification"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">
                    {activity.message}
                  </p>

                  <p className="mt-2 text-[11px] font-medium text-slate-400">
                    {formattedDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === "PAYMENT_FAILED" || type === "BOOKING_REJECTED") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <XCircle size={18} />
      </div>
    );
  }

  if (type.includes("PAYMENT")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <CreditCard size={18} />
      </div>
    );
  }

  if (type.includes("BOOKING")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <CalendarDays size={18} />
      </div>
    );
  }

  if (type === "PROVIDER_APPLICATION") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        <UserRound size={18} />
      </div>
    );
  }

  if (type === "SYSTEM_ALERT") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <AlertCircle size={18} />
      </div>
    );
  }

  if (type.includes("SERVICE")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        <Wrench size={18} />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
      <Bell size={18} />
    </div>
  );
}