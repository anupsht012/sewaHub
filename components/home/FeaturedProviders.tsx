import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  BadgeCheck,
  Briefcase,
  Star,
} from "lucide-react";


export default async function FeaturedProviders() {


  const providers = await prisma.provider.findMany({

    take: 6,

    include: {

      user: true,

      services: {

        include: {

          reviews: true,

        },

      },

    },

    orderBy: {
      createdAt: "desc",
    },

  });





  return (

    <section className="bg-gray-50 py-20">


      <div className="container mx-auto px-6">



        <div className="mb-12 text-center">


          <h2 className="text-4xl font-bold">
            Featured Providers
          </h2>


          <p className="mt-3 text-gray-600">
            Trusted professionals near you.
          </p>


        </div>






        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">



          {providers.map((provider)=>{


            const allReviews =
              provider.services.flatMap(
                service => service.reviews
              );



            const rating =
              allReviews.length > 0
              ? (
                  allReviews.reduce(
                    (sum, review)=>
                      sum + review.rating,
                    0
                  )
                  /
                  allReviews.length
                ).toFixed(1)

              : null;





            return (


              <div

                key={provider.id}

                className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"

              >





                <div className="flex items-center gap-4">



                  {provider.user.image ? (


                    <Image

                      src={provider.user.image}

                      alt={provider.user.name}

                      width={70}

                      height={70}

                      className="h-16 w-16 rounded-full object-cover"

                    />


                  ) : (


                    <div

                      className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white"

                    >

                      {provider.user.name
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                  )}



                  <div>


                    <div className="flex items-center gap-2">


                      <h3 className="text-xl font-bold">

                        {provider.user.name}

                      </h3>



                      {provider.verified && (

                        <BadgeCheck
                          className="text-green-600"
                          size={20}
                        />

                      )}


                    </div>



                    {provider.verified && (

                      <p className="text-sm text-green-600">

                        Verified Provider

                      </p>

                    )}


                  </div>



                </div>







                <div className="mt-6 space-y-3 text-sm text-gray-600">



                  <p className="flex items-center gap-2">

                    <MapPin size={16}/>

                    {provider.location}

                  </p>





                  <p className="flex items-center gap-2">

                    <Briefcase size={16}/>

                    {provider.services.length}

                    {" "}
                    Services

                  </p>






                  <p className="flex items-center gap-2">


                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />


                    {rating
                      ? `${rating} (${allReviews.length} reviews)`
                      : "No reviews yet"
                    }


                  </p>



                </div>







                {provider.bio && (

                  <p className="mt-5 line-clamp-3 text-gray-500">

                    {provider.bio}

                  </p>

                )}







                <Link href="/services">


                  <Button className="mt-6 w-full">

                    View Services

                  </Button>


                </Link>




              </div>


            );


          })}


        </div>




      </div>



    </section>


  );

}