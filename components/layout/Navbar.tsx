"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import LOGO from "@/public/logo.png";
import NotificationBell from "../notifications/NotificationBell";

interface NavUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export default function Navbar({ user }: { user?: NavUser | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const userLinks =
    user?.role === "PROVIDER"
    ? [
          { name: "Provider Dashboard", href: "/provider/dashboard" },
          { name: "My Services", href: "/provider/services" },
          { name: "My Offers", href: "/provider/offers" },
        ]
      : user?.role === "ADMIN"
    ? [{ name: "Admin Panel", href: "/admin/dashboard" }]
      : [
          { name: "Dashboard", href: "/dashboard" },
          { name: "My Requests", href: "/dashboard/requests" },
          { name: "My Bookings", href: "/dashboard/bookings" },
        ];

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await authClient.signOut();
      toast.success("Logged out successfully!");
      setOpen(false);
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
      toast.error("Logout failed");
    }
  }

  // FIXED: only body, not html - so sticky header doesn't disappear
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <Image src={LOGO} alt="KaamSewa Logo" width={90} height={90} style={{ width: "90px", height: "auto" }} />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                {item.name}
              </Link>
            ))}
            {(!user || user.role === "CUSTOMER") && (
              <Link href={user? "/provider/apply" : "/login"} className="text-sm font-medium text-blue-600">
                Become a Provider
              </Link>
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user? (
              <>
                <NotificationBell />
                <div className="relative group">
                  <div className="flex cursor-pointer items-center gap-1 text-sm font-medium">
                    Hi, {user.name} <ChevronDown size={16} />
                  </div>
                  <div className="absolute right-0 top-full hidden pt-3 group-hover:block">
                    <div className="w-52 rounded-xl border bg-white p-2 shadow-xl">
                      {userLinks.map((item) => (
                        <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-2 py-2 text-white hover:bg-red-700" onClick={handleLogout} disabled={loggingOut}>
                  <LogOut size={20} />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="outline">Login</Button></Link>
                <Link href="/register"><Button>Get Started</Button></Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {user && <NotificationBell />}
            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
              {open? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER OUTSIDE HEADER - so header doesn't disappear */}
      <div className={`fixed inset-0 z-[100] md:hidden ${open? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open? "opacity-100" : "opacity-0"}`}
        />
        <div className={`absolute right-0 top-0 flex  w-[60%] max-w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-sm font-bold">Menu</span>
            <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  {item.name}
                </Link>
              ))}
            </div>

            {(!user || user.role === "CUSTOMER") && (
              <div className="mt-4">
                <Link href="/provider/apply" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="h-11 w-full rounded-xl font-bold">Become a Provider</Button>
                </Link>
              </div>
            )}

            <div className="my-4 h-px bg-slate-100" />

            {user? (
              <div className="flex flex-col gap-2">
                <div className="px-3 pb-1">
                  <p className="truncate text-sm font-bold">Hi, {user.name}</p>
                  <p className="truncate text-sm text-slate-500">{user.email}</p>
                </div>
                {userLinks.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    <Button variant="outline" className="h-11 w-full justify-start rounded-xl bg-slate-50 px-3 font-medium">
                      {item.name}
                    </Button>
                  </Link>
                ))}
                <Button variant="destructive" className="mt-2 h-11 w-full rounded-xl font-bold" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="h-11 w-full rounded-xl font-bold">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="h-11 w-full rounded-xl bg-slate-900 font-bold">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}