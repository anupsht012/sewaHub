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
    name: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
  }
 
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        sticky
        top-16
        h-[calc(100vh-4rem)]
        w-72
        shrink-0
        bg-slate-900
        text-white
      "
    >
      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold">
          SewaHub
        </h1>

        <p className="text-sm text-slate-400">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav
        className="
          h-full
          overflow-y-auto
          p-4
          space-y-2
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
    </aside>
  );
}