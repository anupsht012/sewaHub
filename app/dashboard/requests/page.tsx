import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import EditRequestModal from "@/components/customer/EditRequestModal";
import { Button } from "@/components/ui/button";
import CancelRequestModal from "@/components/customer/CancelRequestModal";

export default async function RequestsPage() {


  const user = await getCurrentUser();



  if (!user) {

    redirect("/login");

  }




  const requests =
    await prisma.serviceRequest.findMany({

      where: {

        customerId: user.id,

      },


      orderBy: {

        createdAt: "desc",

      },


    });





  return (


    <div className="space-y-6">



      <h1 className="text-3xl font-bold">

        My Service Requests

      </h1>






      {
        requests.length === 0 ? (


          <div className="rounded-2xl border bg-white p-6">


            <p className="text-gray-500">

              No requests yet.

            </p>


          </div>



        ) : (



          requests?.map((request) => (


            <div

              key={request?.id}

              className="
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
              "

            >





              <div className="flex justify-between gap-5">





                <div className="space-y-2">



                  <h2 className="text-xl font-bold">

                    {request?.title}

                  </h2>





                  <p className="text-gray-600">

                    Category: {request?.category}

                  </p>





                  <p className="text-gray-700">

                    {request?.description}

                  </p>





                  <p className="text-sm text-gray-500">

                    Location: {request?.location}

                  </p>





                  <p className="text-sm text-gray-500">

                    Phone: {request?.phone}

                  </p>





                  {
                    request.budget && (

                      <p className="text-sm text-gray-500">

                        Budget: Rs. {request?.budget}

                      </p>

                    )
                  }





                  {
                    request?.preferredDate && (

                      <p className="text-sm text-gray-500">

                        Preferred Date:{" "}

                        {
                          new Date(
                            request.preferredDate
                          ).toLocaleDateString()
                        }

                      </p>

                    )
                  }





                </div>







                <span
  className={`
    h-fit
    rounded-full
    px-3
    py-1
    text-sm
    font-medium

    ${
      request.status === "OPEN"
      ? "bg-blue-100 text-blue-700"

      : request.status === "ACCEPTED"
      ? "bg-green-100 text-green-700"

      : request.status === "CANCELLED"
      ? "bg-red-100 text-red-700"

      : "bg-gray-100 text-gray-700"
    }
  `}
>
  {request.status}
</span>






              </div>








              <div className="mt-5 flex items-center gap-4">





                <EditRequestModal

                  request={request}

                />







                <CancelRequestModal

                  requestId={request.id}

                />






              </div>





            </div>



          ))

        )

      }







    </div>


  );

}