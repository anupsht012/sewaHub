"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  CalendarDays,
  Inbox,
  Star,
  User,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/provider/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    href: "/provider/analytics",
    icon: TrendingUp,
  },
  {
    name: "My Services",
    href: "/provider/services",
    icon: Briefcase,
  },
  {
    name: "Bookings",
    href: "/provider/bookings",
    icon: CalendarDays,
  },
  {
    name: "Service Requests",
    href: "/provider/requests",
    icon: ClipboardList,
  },
  {
    name: "Offers",
    href: "/provider/offers",
    icon: Inbox,
  },
  {
    name: "Reviews",
    href: "/provider/reviews",
    icon: Star,
  },
  {
    name: "Profile",
    href: "/provider/profile",
    icon: User,
  },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        sticky
        top-0
        z-40
        w-full
        bg-slate-900
        text-white
        md:top-16
        md:h-[calc(100vh-4rem)]
        md:w-72
        md:shrink-0
      "
    >
      {/* Header */}
      <div className="border-b border-slate-800 p-4 md:p-6">
        <h1 className="text-xl font-bold md:text-2xl">KaamSewa</h1>
        <p className="text-xs text-slate-400 md:text-sm">Provider Panel</p>
      </div>

      {/* Navigation */}
      <nav
        className="
          flex
          overflow-x-auto
          gap-2
          p-3
          no-scrollbar
          md:flex-col
          md:overflow-x-visible
          md:overflow-y-auto
          md:space-y-2
          md:gap-0
          md:p-4
        "
      >
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            pathname === link.href ||
            pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex
                shrink-0
                items-center
                gap-2.5
                rounded-xl
                px-3.5
                py-2
                text-sm
                transition
                whitespace-nowrap
                md:gap-3
                md:px-4
                md:py-3
                md:text-base
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon size={18} className="shrink-0 md:w-5 md:h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}