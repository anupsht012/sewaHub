"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Briefcase, Wrench, Calendar,
  UserPlus, TrendingUp, DollarSign, Stars, Menu, X, Mail, LogOut
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Providers", href: "/admin/providers", icon: Briefcase },
  { name: "Provider Requests", href: "/admin/provider-applications", icon: UserPlus },
  { name: "Reviews", href: "/admin/reviews", icon: Stars },
  { name: "Payments", href: "/admin/payments", icon: DollarSign },
  { name: "Profile", href: "/admin/profile", icon: Users },
  { name: "Contact Messages", href: "/admin/contacts", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const Nav = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1 p-3 md:p-4">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href || pathname.startsWith(link.href + "/");
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
      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-slate-900 px-4 text-white md:hidden">
        <div>
          <h1 className="text-sm font-bold leading-none">KaamSewa</h1>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
        <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-800">
          <Menu size={18} />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[100] md:hidden ${open ? "visible" : "invisible"}`}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute left-0 top-0 flex h-[100dvh] w-[60%] max-w-[300px] flex-col bg-slate-900 text-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4">
            <h1 className="text-sm font-bold">KaamSewa</h1>
            <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-800">
              <X size={16} />
            </button>
          </div>
          <div className="h-0 flex-1 overflow-y-auto no-scrollbar">
            <Nav onClick={() => setOpen(false)} />
          </div>
          <div className="shrink-0 border-t border-slate-800 bg-slate-900 p-3">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-red-600 hover:text-white">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>
      </div>

      {/* DESKTOP */}
      <aside className="hidden md:sticky md:top-16 md:z-40 md:flex md:h-[calc(100vh-4rem)] md:w-72 md:shrink-0 md:flex-col md:bg-slate-900 md:text-white">
        <div className="shrink-0 border-b border-slate-800 p-6">
          <h1 className="text-2xl font-bold">KaamSewa</h1>
          <p className="text-sm text-slate-400">Admin Panel</p>
        </div>

        <div className="h-0 flex-1 overflow-y-auto no-scrollbar">
          <Nav />
          <div className="h-10" />
        </div>

        <div className="shrink-0 border-t border-slate-800 bg-slate-900 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}