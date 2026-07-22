import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import EditProviderModal from "@/components/EditProviderModal";
import AddServiceModal from "@/components/AddServiceModal";
import EditServiceModal from "@/components/EditServiceModal";
import DeleteServiceModal from "@/components/DeleteServiceModal";
import ProviderBookings from "@/components/ProviderBookings";


export default async function ProviderDashboardPage() {


  const user = await getCurrentUser();



  if (!user) {
    redirect("/login");
  }



  if (user.role !== "PROVIDER") {
    redirect("/dashboard");
  }






  const provider = await prisma.provider.findUnique({

    where: {
      userId: user.id,
    },


    include: {

      services: {

        include: {

          reviews: {

            include: {
              customer: true,
            },

            orderBy: {
              createdAt: "desc",
            },

          },

        },

      },

    },

  });





  if (!provider) {
    redirect("/provider/setup");
  }






  return (

    <div className="min-h-screen bg-gray-50 p-10">


      <div className="mx-auto max-w-5xl space-y-6">






        {/* Profile Card */}


        <div className="rounded-3xl bg-white p-8 shadow">



          <div className="flex items-center justify-between">


            <div>


              <h1 className="text-3xl font-bold">
                Welcome, {user.name} 👋
              </h1>



              <p className="mt-2 text-gray-500">
                {provider.bio}
              </p>


            </div>





            <div>


              {provider.verified ? (

                <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
                  Verified
                </span>


              ) : (


                <span className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">
                  Pending Verification
                </span>


              )}


            </div>


          </div>





          <div className="mt-6">


            <p>
              📍 {provider.location}
            </p>


            <EditProviderModal provider={provider} />


          </div>


        </div>









        {/* Services */}



        <div className="rounded-3xl bg-white p-8 shadow">


          <div className="flex items-center justify-between">


            <h2 className="text-2xl font-bold">
              My Services
            </h2>


            <AddServiceModal />


          </div>





          {
            provider.services.length === 0 ? (


              <p className="mt-6 text-gray-500">
                No services created yet.
              </p>



            ) : (



              <div className="mt-6 grid gap-4 md:grid-cols-2">


                {provider.services.map((service)=>(


                  <div

                    key={service.id}

                    className="rounded-xl border p-5"

                  >


                    <h3 className="font-bold">
                      {service.name}
                    </h3>




                    <p className="mt-2 text-gray-500">
                      {service.description}
                    </p>




                    <p className="mt-3 font-semibold">
                      Rs. {service.price}
                    </p>





                    <div className="mt-4 flex gap-3">


                      <EditServiceModal
                        service={service}
                      />



                      <DeleteServiceModal
                        serviceId={service.id}
                      />



                    </div>



                  </div>



                ))}



              </div>



            )
          }



        </div>









        {/* Booking Requests */}



        <div className="rounded-3xl bg-white p-8 shadow">


          <h2 className="text-2xl font-bold">
            Booking Requests
          </h2>



          <ProviderBookings />



        </div>









        {/* Customer Reviews */}



        <div className="rounded-3xl bg-white p-8 shadow">



          <h2 className="text-2xl font-bold">
            Customer Reviews ⭐
          </h2>





          <div className="mt-6 space-y-4">





            {
              provider.services.every(
                (service) =>
                  service.reviews.length === 0
              ) ? (


                <p className="text-gray-500">
                  No reviews yet.
                </p>



              ) : (



                provider.services.map((service)=>(


                  service.reviews.map((review)=>(


                    <div

                      key={review.id}

                      className="rounded-xl border p-5"

                    >



                      <div className="flex justify-between">


                        <h3 className="font-semibold">
                          {review.customer.name}
                        </h3>



                        <span className="text-yellow-600">
                          {"⭐".repeat(review.rating)}
                        </span>



                      </div>





                      <p className="mt-3 text-gray-600">

                        {review.comment || "No comment"}

                      </p>





                      <p className="mt-2 text-sm text-gray-400">

                        Service: {service.name}

                      </p>




                    </div>



                  ))



                ))



              )
            }



          </div>



        </div>





      </div>



    </div>

  );

}