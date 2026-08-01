import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import AddServiceModal from "@/components/provider/AddServiceModal";
import DeleteServiceModal from "@/components/provider/DeleteServiceModal";
import EditServiceModal from "@/components/provider/EditServiceModal";



export default async function ProviderServicesPage() {


  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role !== "PROVIDER") {
    redirect("/");
  }



  const provider = await prisma.provider.findUnique({

    where: {
      userId: user.id,
    },

  });



  if (!provider) {

    return (

      <div className="rounded-xl bg-white p-8 shadow">

        Provider profile not found

      </div>

    );

  }





  const services = await prisma.service.findMany({

    where: {

      providerId: provider.id,

    },


    include: {

      _count: {

        select: {

          bookings: true,

          reviews: true,

        },

      },

    },


    orderBy: {

      createdAt: "desc",

    },


  });





  return (

    <div className="space-y-8 p-6 md:p-8">


      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


        <div>

          <h1 className="text-3xl font-bold tracking-tight">

            My Services

          </h1>


          <p className="mt-2 text-gray-500">

            Manage your services, bookings and customer reviews.

          </p>


        </div>



        <AddServiceModal />


      </div>





      {
        services.length === 0 ? (


          <div
            className="
              rounded-2xl
              bg-white
              p-10
              text-center
              shadow-sm
            "
          >

            <h2 className="text-xl font-semibold">

              No services created

            </h2>


            <p className="mt-2 text-gray-500">

              Create your first service and start receiving bookings.

            </p>


          </div>


        ) : (



          <div
            className="
              grid
              gap-6
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >



            {
              services?.map((service) => (


                <Card

                  key={service.id}

                  className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "

                >


                  {/* Top Color Bar */}

                  <div className="h-1 bg-blue-600" />




                  <CardHeader className="pb-3">


                    <div className="flex justify-between gap-3">


                      <div>


                        <CardTitle className="text-xl">

                          {service.name}

                        </CardTitle>



                        <span
                          className="
                          mt-3
                          inline-flex
                          rounded-full
                          bg-blue-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-blue-700
                        "
                        >

                          {service.category}

                        </span>


                      </div>



                    </div>


                  </CardHeader>





                  <CardContent className="space-y-5">



                    <p
                      className="
                      line-clamp-3
                      min-h-[60px]
                      text-sm
                      text-gray-500
                    "
                    >

                      {
                        service.description ||
                        "No description available"
                      }

                    </p>





                    {/* Stats */}

                    <div
                      className="
                      grid
                      grid-cols-2
                      gap-3
                    "
                    >


                      <div
                        className="
                        rounded-xl
                        bg-gray-50
                        p-3
                      "
                      >

                        <p className="text-xs text-gray-500">

                          Price

                        </p>


                        <p
                          className="
                          mt-1
                          text-lg
                          font-bold
                          text-blue-600
                        "
                        >

                          NPR {service.price}

                        </p>


                      </div>





                      <div
                        className="
                        rounded-xl
                        bg-gray-50
                        p-3
                      "
                      >

                        <p className="text-xs text-gray-500">

                          Bookings

                        </p>


                        <p className="mt-1 text-lg font-bold">

                          {service._count.bookings}

                        </p>


                      </div>


                    </div>






                    <div className="text-xs text-gray-400">

                      Created:

                      {" "}

                      {
                        new Date(
                          service.createdAt
                        ).toLocaleDateString()
                      }


                    </div>





                    {/* Actions */}


                    <div
                      className="
                      flex
                      gap-3
                      border-t
                      pt-4
                    "
                    >



                      <EditServiceModal service={service} />





                      <DeleteServiceModal

                        serviceId={service.id}

                      />



                    </div>




                  </CardContent>



                </Card>



              ))
            }




          </div>


        )
      }



    </div>

  );

}