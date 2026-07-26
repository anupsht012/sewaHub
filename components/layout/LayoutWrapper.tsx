"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/admin");

  return (
    <>
      { <Navbar />}

      {children}

      {!isDashboard && <Footer />}
    </>
  );
}