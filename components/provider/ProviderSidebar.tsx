"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  CalendarDays,
  Inbox,
  Star,
  User,
  ClipboardList,
  TrendingUp,
} from "lucide-react";


const links = [

  {
    name: "Dashboard",
    href: "/provider/dashboard",
    icon: LayoutDashboard,
  },

{
name: "Analytics",
    href: "/provider/analytics",
    icon: TrendingUp,
},
  {
    name: "My Services",
    href: "/provider/services",
    icon: Briefcase,
  },


  {
    name: "Bookings",
    href: "/provider/bookings",
    icon: CalendarDays,
  },
  {
    name: "Service Requests",
    href: "/provider/requests",
    icon: ClipboardList,
  },

  {
    name: "Offers",
    href: "/provider/offers",
    icon: Inbox,
  },


  {
    name: "Reviews",
    href: "/provider/reviews",
    icon: Star,
  },


  {
    name: "Profile",
    href: "/provider/profile",
    icon: User,
  },

];



export default function ProviderSidebar() {


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
          KaamSewa
        </h1>


        <p className="text-sm text-slate-400">
          Provider Panel
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


                ${active
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