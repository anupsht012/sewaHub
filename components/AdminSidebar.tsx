"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Calendar,
} from "lucide-react";

import LogoutButton from "@/components/LogoutButton";


const links = [

  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },

  {
    name: "Providers",
    href: "/admin/providers",
    icon: Briefcase,
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

];



export default function AdminSidebar() {


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
          flex-1
          space-y-2
          overflow-y-auto
          p-4
        "
      >


        {links?.map((link)=>{


          const Icon = link.icon;


          return (

            <Link

              key={link.href}

              href={link.href}

              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                transition
                hover:bg-slate-800
              "

            >

              <Icon size={20}/>

              {link.name}


            </Link>

          );


        })}



      </nav>







      {/* Logout */}

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