"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Calendar,
  UserPlus,
  TrendingUp,
  DollarSign,
  Stars,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Providers",
    href: "/admin/providers",
    icon: Briefcase,
  },
  {
    name: "Provider Requests",
    href: "/admin/provider-applications",
    icon: UserPlus,
  },
  {
name: "Reviews",
    href: "/admin/reviews",
    icon: Stars,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: Users,
  },
];

export default function AdminSidebar() {
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
        <p className="text-xs text-slate-400 md:text-sm">Admin Panel</p>
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