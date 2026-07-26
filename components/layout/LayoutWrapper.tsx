"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function LayoutWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {


  const pathname = usePathname();


  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/admin");



  return (

    <>

      
        <Navbar user={user} />


      {children}


      {!isDashboard && (
        <Footer />
      )}


    </>

  );

}