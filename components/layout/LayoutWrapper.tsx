"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Fetch user in background — doesn't block page redirect
  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
     .then(r => r.json())
     .then(d => setUser(d.user))
     .catch(() => {});
  }, [pathname]); // refetch on route change = fresh role

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/admin");

  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}