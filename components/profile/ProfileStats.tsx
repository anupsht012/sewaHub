"use client";

import {
  CalendarDays,
  Clock3,
  Star,
  Wallet,
  Briefcase,
  Users,
  DollarSign,
  ClipboardList,
} from "lucide-react";


type Stat = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};


type ProfileStatsProps = {
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  stats: {
    bookings?: number;
    activeBookings?: number;
    reviews?: number;
    spent?: number;


    services?: number;
    completedJobs?: number;
    earnings?: number;
    rating?: number;
    length?: number;

    users?: number;
    providers?: number;
    revenue?: number;
    notifications?: number;
  };
};



export default function ProfileStats({
  role,
  stats,
}: ProfileStatsProps) {


  const customerStats: Stat[] = [
    {
      title: "Total Bookings",
      value: stats.bookings ?? 0,
      icon:<CalendarDays size={22}/>
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings ?? 0,
      icon:<Clock3 size={22}/>
    },
    {
      title: "Reviews Given",
      value: stats.reviews ?? 0,
      icon:<Star size={22}/>
    },
    {
      title: "Total Spent",
      value:`NPR ${stats.spent ?? 0}`,
      icon:<Wallet size={22}/>
    },
  ];



  const providerStats: Stat[] = [
    {
      title:"Services",
      value:stats.services ?? 0,
      icon:<Briefcase size={22}/>
    },
    {
      title:"Completed Jobs",
      value:stats.completedJobs ?? 0,
      icon:<ClipboardList size={22}/>
    },
    {
      title:"Rating",
      value:stats.rating ?? 0,
      icon:<Star size={22}/>
    },
    {
      title:"Total Earnings",
      value:`NPR ${stats.earnings ?? 0}`,
      icon:<Wallet size={22}/>
    },
  ];



  const adminStats: Stat[] = [
    {
      title:"Total Users",
      value:stats.users ?? 0,
      icon:<Users size={22}/>
    },
    {
      title:"Providers",
      value:stats.providers ?? 0,
      icon:<Briefcase size={22}/>
    },
    {
      title:"Revenue",
      value:`NPR ${stats.revenue ?? 0}`,
      icon:<DollarSign size={22}/>
    },
    {
      title:"Bookings",
      value:stats.bookings ?? 0,
      icon:<ClipboardList size={22}/>
    },
  ];



  const data =
    role === "CUSTOMER"
      ? customerStats
      : role === "PROVIDER"
      ? providerStats
      : adminStats;



  return (

    <div className="
      grid
      grid-cols-1
      gap-4
      sm:grid-cols-2
      xl:grid-cols-4
    ">

      {
        data.map((item)=>(
          
          <div
            key={item.title}
            className="
              rounded-2xl
              border
              bg-white
              p-5
              shadow-sm
              transition
              hover:shadow-md
            "
          >

            <div className="
              flex
              items-center
              justify-between
            ">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-gray-100
                "
              >
                {item.icon}
              </div>


            </div>



            <p className="
              mt-4
              text-sm
              text-gray-500
            ">
              {item.title}
            </p>


            <h3 className="
              mt-1
              text-2xl
              font-bold
            ">
              {item.value}
            </h3>


          </div>

        ))
      }


    </div>

  );
}