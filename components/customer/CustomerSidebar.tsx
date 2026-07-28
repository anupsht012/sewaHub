"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  PlusCircle,
  Search,
  ClipboardList,
  CalendarDays,
  Star,
  User,
  UserPlus,
} from "lucide-react";


const links = [

  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },


  {
    name: "Request Service",
    href: "/dashboard/request-service",
    icon: PlusCircle,
  },


  {
    name: "Find Services",
    href: "/services",
    icon: Search,
  },


  {
    name: "My Requests",
    href: "/dashboard/requests",
    icon: ClipboardList,
  },


  {
    name: "My Bookings",
    href: "/dashboard/bookings",
    icon: CalendarDays,
  },


  {
    name: "My Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },

  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },

];



export default function CustomerSidebar() {


  const pathname = usePathname();



  return (

    <aside

      className="
        sticky
        top-16
        flex
        h-[calc(100vh-4rem)]
        w-72
        shrink-0
        flex-col
        bg-slate-900
        text-white
      "

    >



      {/* Header */}


      <div

        className="
          border-b
          border-slate-800
          p-6
        "

      >


        <h1 className="text-2xl font-bold">
          SewaHub
        </h1>


        <p className="text-sm text-slate-400">
          Customer Panel
        </p>


      </div>





      {/* Navigation */}


      <nav

        className="
          flex-1
          overflow-y-auto
          space-y-2
          p-4
        "

      >



        {links.map((link) => {


          const Icon = link.icon;



          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"

              : link.href === "/services"
              ? pathname === "/services"

              : pathname === link.href ||
                pathname.startsWith(
                  link.href + "/"
                );




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


              <span>
                {link.name}
              </span>


            </Link>


          );


        })}



      </nav>



    </aside>

  );

}