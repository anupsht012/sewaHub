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

import LogoutButton from "@/components/shared/LogoutButton";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Request Service",
    href: "dashboard/request-service",
    icon: PlusCircle,
    primary: true,
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
        flex
        h-screen
        w-72
        shrink-0
        flex-col
        bg-slate-900
        text-white
      "
    >
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold">
          SewaHub
        </h1>

        <p className="text-sm text-slate-400">
          Customer Panel
        </p>
      </div>

      <nav
        className="
          flex-1
          space-y-2
          overflow-y-auto
          p-4
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
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                transition

                ${
                  active
                    ? "bg-blue-600 text-white"
                    : link.primary
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "hover:bg-slate-800"
                }
              `}
            >
              <Icon size={20} />

              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className="
          border-t
          border-slate-800
          p-4
        "
      >
        <LogoutButton />
      </div>
    </aside>
  );
}