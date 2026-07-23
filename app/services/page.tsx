import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BadgeCheck, MapPin, Star } from "lucide-react";


interface PageProps {

  searchParams: Promise<{
    service?: string;
    location?: string;
  }>;

}



export default async function ServicesPage({
  searchParams,
}: PageProps) {


  const {
    service,
    location,
  } = await searchParams;





  const services = await prisma.service.findMany({

    where: {

      AND: [

        service
          ? {
              name: {
                contains: service,
                mode: "insensitive",
              },
            }
          : {},



        location
          ? {
              provider: {

                location: {

                  contains: location,

                  mode: "insensitive",

                },

              },

            }

          : {},

      ],

    },



    include: {

      provider: {

        include: {

          user: true,

        },

      },


      reviews: true,


    },



    orderBy: {

      createdAt: "desc",

    },


  });






  return (


    <div className="min-h-screen bg-gray-50">


      <div className="mx-auto max-w-7xl px-6 py-12">






        <div className="mb-10">


          <h1 className="text-4xl font-bold">


            {service || location

              ? "Search Results"

              : "Find Trusted Services"

            }


          </h1>




          <p className="mt-3 text-gray-500">

            Discover verified professionals across Nepal.

          </p>





          {(service || location) && (

            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-blue-700">


              Showing results


              {service && (

                <>
                  {" "}for <b>{service}</b>
                </>

              )}



              {location && (

                <>
                  {" "}in <b>{location}</b>
                </>

              )}



            </div>

          )}




        </div>








        {services.length === 0 ? (



          <div className="rounded-3xl bg-white p-10 text-center shadow">


            <h2 className="text-2xl font-bold">

              No services found

            </h2>



            <p className="mt-3 text-gray-500">

              Try another service or location.

            </p>





            <Link href="/services">


              <Button className="mt-6">

                View All Services

              </Button>


            </Link>




          </div>



        ) : (



          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">





            {services?.map((service:any)=>{



              const averageRating =

                service.reviews.length > 0

                ? (

                    service.reviews.reduce(

                      (sum,review)=>

                        sum + review.rating,

                      0

                    )

                    /

                    service.reviews.length

                  ).toFixed(1)


                : null;







              return (




                <div

                  key={service.id}

                  className="
                  rounded-3xl
                  bg-white
                  p-6
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                  "

                >







                  <div className="flex justify-between gap-4">



                    <h2 className="text-xl font-bold">

                      {service.name}

                    </h2>





                    <span className="
                    h-fit
                    rounded-full
                    bg-blue-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-blue-700
                    ">

                      Rs. {service.price}

                    </span>




                  </div>







                  <p className="mt-4 line-clamp-3 text-gray-600">


                    {service.description ||

                      "Professional service from trusted provider."

                    }


                  </p>







                  <div className="mt-6 space-y-3 text-sm text-gray-600">



                    <p className="flex items-center gap-2">

                      👤

                      {service.provider.user.name}


                      {service.provider.verified && (

                        <BadgeCheck

                          size={18}

                          className="text-green-600"

                        />

                      )}


                    </p>





                    <p className="flex items-center gap-2">


                      <MapPin size={16}/>


                      {service.provider.location}


                    </p>






                  </div>








                  {averageRating ? (



                    <p className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-yellow-600
                    ">


                      <Star

                        size={16}

                        className="fill-yellow-400"

                      />


                      {averageRating}

                      {" "}

                      ({service.reviews.length} reviews)


                    </p>



                  ) : (



                    <p className="mt-5 text-sm text-gray-400">

                      No reviews yet

                    </p>



                  )}









                  <Link href={`/services/${service.id}`}>



                    <Button className="mt-6 w-full">


                      View Details


                    </Button>



                  </Link>







                </div>



              );



            })}





          </div>



        )}




      </div>



    </div>



  );

}