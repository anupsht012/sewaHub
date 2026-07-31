"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  PlusCircle,
  Search,
  ClipboardList,
  CalendarDays,
  Star,
  User,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Request Service",
    href: "/dashboard/request-service",
    icon: PlusCircle,
  },
  {
    name: "Find Services",
    href: "/services",
    icon: Search,
  },
  {
    name: "My Requests",
    href: "/dashboard/requests",
    icon: ClipboardList,
  },
  {
    name: "My Bookings",
    href: "/dashboard/bookings",
    icon: CalendarDays,
  },
  {
    name: "My Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function CustomerSidebar() {
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
        <p className="text-xs text-slate-400 md:text-sm">Customer Panel</p>
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
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : link.href === "/services"
              ? pathname === "/services"
              : pathname === link.href ||
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