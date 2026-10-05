"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  ClipboardList,
  CalendarDays,
  Star,
  User,
  Menu,
  X,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Request Service", href: "/dashboard/request-service", icon: PlusCircle },
  { name: "Find Services", href: "/services", icon: Search },
  { name: "My Requests", href: "/dashboard/requests", icon: ClipboardList },
  { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { name: "My Reviews", href: "/dashboard/reviews", icon: Star },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const Nav = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1 p-3 md:gap-0 md:p-4 md:space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : link.href === "/services"
              ? pathname === "/services"
              : pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
          >
            <Icon size={18} className="shrink-0" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>

      {/* DARK BAR - STICKY BELOW WHITE NAVBAR */}
      <div className="sticky top-14 z-30 flex h-14 items-center justify-between bg-slate-900 px-4 text-white md:hidden">
        <div>
          <h1 className="text-base font-bold leading-none">KaamSewa</h1>
          <p className="text-xs text-slate-400">Customer Panel</p>
        </div>
        <button onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-800">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* MOBILE DRAWER - HIGH Z-INDEX WHEN OPEN */}
      <div className={`fixed inset-0 top-30 md:hidden ${open ? "z-[100] visible" : "z-0 invisible"}`}>
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"
            }`}
        />
        {/* Sidebar - highest z */}
        <aside
          className={`absolute left-0 top-0 z-[101] flex h-[100dvh] w-[60%] max-w-[300px] flex-col bg-slate-900 text-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
            <span className="font-bold">Menu</span>
            <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-800">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-2">
            <Nav onClick={() => setOpen(false)} />
          </div>
        </aside>
      </div>

      {/* DESKTOP */}
      <aside className="hidden md:sticky md:top-16 md:z-40 md:flex md:h-[calc(100vh-4rem)] md:w-72 md:shrink-0 md:flex-col md:bg-slate-900 md:text-white">
        <div className="border-b border-slate-800 p-6">
          <h1 className="text-2xl font-bold">KaamSewa</h1>
          <p className="text-sm text-slate-400">Customer Panel</p>
        </div>
        <Nav />
      </aside>
    </>
  );
}