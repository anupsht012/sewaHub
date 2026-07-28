import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import VerifyProviderButton from "@/components/admin/VerifyProviderButton";
import UnverifyProviderButton from "@/components/admin/UnverifyProviderButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";


interface Props {
  params: Promise<{
    id: string;
  }>;
}


export default async function AdminProviderDetailsPage({
  params,
}: Props) {


  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role !== "ADMIN") {
    redirect("/");
  }



  const { id } = await params;



  const provider = await prisma.provider.findUnique({

    where:{
      id,
    },


    include:{

      user:true,


      services:{

        include:{

          reviews:{

            include:{
              customer:true,
            },

            orderBy:{
              createdAt:"desc",
            },

          },

        },

      },

    },

  });



  if(!provider){
    notFound();
  }



  const reviews = provider.services.flatMap(
    service =>
      service.reviews.map(review=>({
        ...review,
        serviceName:service.name,
      }))
  );




  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-6xl space-y-6">



        <Link href="/admin/providers">

          <Button variant="outline" className="cursor-pointer border-none" >
            ← Back
          </Button>

        </Link>





        {/* Provider Info */}


        <div className="rounded-3xl bg-white p-8 shadow">


          <div className="flex items-start justify-between">


            <div>


              <h1 className="text-3xl font-bold">
                {provider.user.name}
              </h1>


              <p className="text-gray-500">
                {provider.user.email}
              </p>



              <p className="mt-4">
                📍 {provider.location}
              </p>



              <p className="mt-2">
                Total Services: {provider.services.length}
              </p>


            </div>




            <div>


              {
                provider.verified ?

                <UnverifyProviderButton
                  providerId={provider.id}
                />

                :

                <VerifyProviderButton
                  providerId={provider.id}
                />

              }


            </div>


          </div>


        </div>







        {/* Services */}


        <div className="rounded-3xl bg-white p-8 shadow">


          <h2 className="text-2xl font-bold">
            Services
          </h2>



          <div className="mt-6 grid gap-5 md:grid-cols-2">


            {
              provider.services.map(service=>(


                <div
                  key={service.id}
                  className="rounded-xl border p-5"
                >


                  <h3 className="text-xl font-bold">
                    {service.name}
                  </h3>


                  <p className="mt-2 text-gray-600">
                    {service.description}
                  </p>


                  <p className="mt-3 font-semibold">
                    Rs. {service.price}
                  </p>


                  <p className="mt-2 text-sm text-gray-500">
                    Reviews: {service.reviews.length}
                  </p>


                </div>


              ))
            }


          </div>


        </div>








        {/* Reviews */}


        <div className="rounded-3xl bg-white p-8 shadow">


          <h2 className="text-2xl font-bold">
            Customer Reviews ⭐
          </h2>



          <div className="mt-6 space-y-4">


            {
              reviews.length === 0 ? (

                <p className="text-gray-500">
                  No reviews yet.
                </p>

              ) : (

                reviews.map(review=>(


                  <div
                    key={review.id}
                    className="rounded-xl border p-5"
                  >


                    <div className="flex justify-between">


                      <p className="font-semibold">
                        {review.customer.name}
                      </p>



                      <span className="text-yellow-600">
                        {"⭐".repeat(review.rating)}
                      </span>


                    </div>



                    <p className="mt-3 text-gray-600">
                      {review.comment || "No comment"}
                    </p>



                    <p className="mt-2 text-sm text-gray-400">
                      Service: {review.serviceName}
                    </p>


                  </div>


                ))

              )
            }



          </div>


        </div>



      </div>


    </div>

  );

}