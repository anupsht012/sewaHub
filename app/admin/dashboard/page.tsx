import { prisma } from "@/lib/prisma";
import {
  Users,
  UserCheck,
  Wrench,
  CalendarCheck,
  Star,
  Mail,
} from "lucide-react";


export default async function AdminDashboardPage() {


  const [
    users,
    providers,
    services,
    bookings,
    reviews,
    messages,
    recentBookings,
    recentUsers,
  ] = await Promise.all([


    prisma.user.count(),


    prisma.provider.count(),


    prisma.service.count(),


    prisma.booking.count(),


    prisma.review.count(),


    prisma.contactMessage.count(),



    prisma.booking.findMany({

      take:5,

      orderBy:{
        createdAt:"desc",
      },

      include:{
        customer:true,
        service:true,
      },

    }),



    prisma.user.findMany({

      take:5,

      orderBy:{
        createdAt:"desc",
      },

    }),



  ]);





  const cards = [

    {
      title:"Users",
      value:users,
      icon:Users,
      color:"bg-blue-100 text-blue-600",
    },


    {
      title:"Providers",
      value:providers,
      icon:UserCheck,
      color:"bg-green-100 text-green-600",
    },


    {
      title:"Services",
      value:services,
      icon:Wrench,
      color:"bg-yellow-100 text-yellow-600",
    },


    {
      title:"Bookings",
      value:bookings,
      icon:CalendarCheck,
      color:"bg-purple-100 text-purple-600",
    },


    {
      title:"Reviews",
      value:reviews,
      icon:Star,
      color:"bg-orange-100 text-orange-600",
    },


    {
      title:"Messages",
      value:messages,
      icon:Mail,
      color:"bg-red-100 text-red-600",
    },


  ];




  return (

    <div>


      <h1 className="mb-8 text-4xl font-bold">
        Admin Dashboard 👑
      </h1>




      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">


        {cards.map((card)=>{


          const Icon = card.icon;


          return (

            <div
              key={card.title}
              className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
              >

                <Icon className="h-7 w-7"/>

              </div>


              <p className="mt-5 text-gray-500">
                {card.title}
              </p>


              <h2 className="mt-2 text-4xl font-bold">
                {card.value}
              </h2>


            </div>

          );


        })}


      </div>






      {/* Recent Bookings */}


      <div className="mt-10 rounded-3xl bg-white p-6 shadow">


        <h2 className="text-2xl font-bold">
          Recent Bookings
        </h2>



        <div className="mt-5 space-y-4">


          {recentBookings.length === 0 ? (

            <p className="text-gray-500">
              No bookings yet.
            </p>

          ) : (


            recentBookings.map((booking:any)=>(

              <div
                key={booking.id}
                className="rounded-xl border p-4"
              >

                <p className="font-semibold">
                  {booking.service.name}
                </p>


                <p className="text-sm text-gray-500">
                  Customer: {booking.customer.name}
                </p>


                <p className="text-sm text-gray-500">
                  Status: {booking.status}
                </p>


              </div>

            ))


          )}


        </div>


      </div>







      {/* Recent Users */}


      <div className="mt-10 rounded-3xl bg-white p-6 shadow">


        <h2 className="text-2xl font-bold">
          New Users
        </h2>



        <div className="mt-5 space-y-4">


          {recentUsers.map((user)=>(


            <div
              key={user.id}
              className="flex justify-between rounded-xl border p-4"
            >

              <div>

                <p className="font-semibold">
                  {user.name}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email}
                </p>

              </div>


              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
                {user.role}
              </span>


            </div>


          ))}


        </div>


      </div>



    </div>

  );

}