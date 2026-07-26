"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function DashboardLayoutCheck() {

  const pathname = usePathname();


  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/admin");


  if (isDashboard) {
    return null;
  }


  return <Footer />;
}