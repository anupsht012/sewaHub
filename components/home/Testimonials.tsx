import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";


export default async function Testimonials() {


  const reviews = await prisma.review.findMany({

    include: {

      customer: true,

      service: true,

    },


    orderBy: {

      createdAt: "desc",

    },


    take: 6,

  });





  return (

    <section className="bg-gray-50 py-20">


      <div className="container mx-auto px-6">


        <div className="mb-12 text-center">


          <h2 className="text-4xl font-bold">
            What People Say
          </h2>


          <p className="mt-3 text-gray-600">
            Trusted by customers and professionals.
          </p>


        </div>





        {reviews.length === 0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow">

            <h3 className="text-xl font-bold">
              No reviews yet
            </h3>

            <p className="mt-2 text-gray-500">
              Customer reviews will appear here.
            </p>

          </div>


        ) : (


          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">


            {reviews.map((review)=>(


              <div
                key={review.id}
                className="
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
                transition
                hover:-translate-y-2
                hover:shadow-xl
                "
              >



                <div className="flex gap-1">

                  {Array.from({
                    length: review.rating
                  }).map((_,index)=>(

                    <Star
                      key={index}
                      className="
                      h-5
                      w-5
                      fill-yellow-400
                      text-yellow-400
                      "
                    />

                  ))}

                </div>





                <p className="mt-5 text-gray-600">

                  "{review.comment || "Great service experience."}"

                </p>





                <div className="mt-6">

                  <h3 className="font-bold">
                    {review.customer.name}
                  </h3>


                  <p className="text-sm text-gray-500">

                    Customer • {review.service.name}

                  </p>


                </div>



              </div>


            ))}


          </div>


        )}



      </div>


    </section>

  );

}