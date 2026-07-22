import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookServiceModal from "@/components/BookServiceModal";

import Link from "next/link";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}



export default async function ServiceDetailsPage({
  params,
}: PageProps) {


  const { id } = await params;



  const service = await prisma.service.findUnique({

    where: {
      id,
    },


    include: {

      reviews: {

        include: {

          customer: true,

        },

        orderBy: {
          createdAt: "desc",
        },

      },


      provider: {

        include: {

          user: true,

          services: true,

        },

      },

    },

  });




  if (!service) {
    notFound();
  }




  const relatedServices = service.provider.services.filter(
    (s) => s.id !== service.id
  );





  const averageRating =
    service.reviews.length > 0
      ? (
          service.reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / service.reviews.length
        ).toFixed(1)
      : null;




  return (

    <div className="min-h-screen bg-gray-50">


      <div className="mx-auto max-w-6xl px-6 py-12">



        <Link
          href="/services"
          className="text-blue-600 hover:underline"
        >
          ← Back to Services
        </Link>





        <div className="mt-8 grid gap-8 lg:grid-cols-3">





          {/* Left */}


          <div className="rounded-3xl bg-white p-8 shadow lg:col-span-2">


            <div className="flex items-center justify-between">


              <h1 className="text-4xl font-bold">
                {service.name}
              </h1>



              <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
                Rs. {service.price}
              </span>


            </div>





            {averageRating ? (

              <p className="mt-5 text-lg font-semibold text-yellow-600">

                ⭐ {averageRating} ({service.reviews.length} reviews)

              </p>


            ) : (

              <p className="mt-5 text-gray-400">
                No reviews yet
              </p>

            )}






            <p className="mt-8 leading-8 text-gray-600">
              {service.description}
            </p>






            {/* Reviews */}


            <div className="mt-10">


              <h2 className="text-2xl font-bold">
                Customer Reviews
              </h2>




              {service.reviews.length === 0 ? (

                <p className="mt-4 text-gray-500">
                  No reviews available yet.
                </p>


              ) : (


                <div className="mt-5 space-y-4">


                  {service.reviews.map((review)=>(


                    <div
                      key={review.id}
                      className="rounded-xl border p-5"
                    >



                      <div className="flex justify-between">


                        <p className="font-semibold">
                          {review.customer.name}
                        </p>



                        <p className="text-yellow-600">

                          {"⭐".repeat(review.rating)}

                        </p>



                      </div>



                      <p className="mt-3 text-gray-600">

                        {review.comment || "No comment"}

                      </p>



                    </div>


                  ))}


                </div>


              )}



            </div>




          </div>









          {/* Right */}



          <div className="rounded-3xl bg-white p-8 shadow">



            <h2 className="text-xl font-bold">
              Provider
            </h2>




            <div className="mt-6 flex items-center gap-4">


              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">

                {service.provider.user.name.charAt(0)}

              </div>




              <div>


                <h3 className="font-semibold">

                  {service.provider.user.name}

                </h3>



                <p className="text-sm text-gray-500">

                  {service.provider.location}

                </p>


              </div>



            </div>






            <div className="mt-6">


              {service.provider.verified ? (

                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">

                  ✅ Verified Provider

                </span>


              ) : (


                <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">

                  Pending Verification

                </span>


              )}



            </div>






            <div className="mt-8">


              <BookServiceModal
                serviceId={service.id}
                serviceName={service.name}
              />


            </div>



          </div>



        </div>









        {/* Related Services */}



        {relatedServices.length > 0 && (


          <div className="mt-12">



            <h2 className="mb-6 text-2xl font-bold">

              More Services from this Provider

            </h2>






            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">



              {relatedServices.map((item)=>(



                <Link

                  key={item.id}

                  href={`/services/${item.id}`}

                  className="rounded-2xl bg-white p-5 shadow transition hover:shadow-lg"

                >



                  <h3 className="font-semibold">

                    {item.name}

                  </h3>




                  <p className="mt-2 text-sm text-gray-500">

                    {item.description}

                  </p>




                  <p className="mt-4 font-bold text-blue-600">

                    Rs. {item.price}

                  </p>



                </Link>



              ))}



            </div>



          </div>



        )}




      </div>


    </div>

  );

}