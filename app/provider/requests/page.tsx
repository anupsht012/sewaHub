import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import RequestActions from "@/components/provider/RequestActions";


export default async function ProviderRequestsPage() {


  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role !== "PROVIDER") {
    redirect("/");
  }




  const provider = await prisma.provider.findUnique({

    where:{
      userId:user.id,
    },

  });




  if(!provider){

    return (

      <div className="p-6">

        <div className="
          rounded-2xl
          bg-white
          p-8
          shadow-sm
        ">

          <h2 className="text-xl font-bold">
            Provider profile not found
          </h2>

        </div>

      </div>

    );

  }






  const requests = await prisma.serviceRequest.findMany({

    where:{

      status:"OPEN",

      providerId:null,

    },


    include:{

      customer:{
        select:{
          name:true,
          image:true,
        },
      },

    },


    orderBy:{
      createdAt:"desc",
    },

  });






  return (

    <div className="
      p-4
      sm:p-6
      lg:p-8
      space-y-6
    ">


      {/* Header */}

      <div>

        <h1 className="
          text-2xl
          md:text-3xl
          font-bold
        ">
          Service Requests
        </h1>


        <p className="
          mt-2
          text-gray-500
        ">
          Accept jobs from customers near you.
        </p>

      </div>







      {
        requests.length === 0 ? (


          <div className="
            rounded-2xl
            bg-white
            p-8
            shadow-sm
            text-center
          ">


            <h2 className="
              text-xl
              font-semibold
            ">
              No requests available
            </h2>


            <p className="
              mt-2
              text-gray-500
            ">
              New customer requests will appear here.
            </p>


          </div>



        ) : (



          <div className="
            grid
            gap-5
            sm:grid-cols-2
            xl:grid-cols-3
          ">


            {
              requests.map((request)=>(


                <div
                  key={request.id}
                  className="
                    rounded-2xl
                    bg-white
                    p-5
                    md:p-6
                    shadow-sm
                    transition
                    hover:shadow-lg
                  "
                >



                  <h2 className="
                    text-xl
                    font-bold
                    line-clamp-1
                  ">
                    {request.title}
                  </h2>




                  <p className="
                    mt-3
                    text-sm
                    text-gray-600
                    line-clamp-3
                  ">
                    {request.description}
                  </p>






                  <div className="
                    mt-5
                    space-y-2
                    text-sm
                    text-gray-500
                  ">


                    <p>
                      <span className="font-medium text-gray-700">
                        Category:
                      </span>{" "}
                      {request.category}
                    </p>



                    <p>
                      <span className="font-medium text-gray-700">
                        Location:
                      </span>{" "}
                      {request.location}
                    </p>




                    <p>
                      <span className="font-medium text-gray-700">
                        Budget:
                      </span>{" "}

                      {
                        request.budget
                        ? `Rs. ${request.budget}`
                        : "Not specified"
                      }

                    </p>




                    <p>
                      <span className="font-medium text-gray-700">
                        Customer:
                      </span>{" "}
                      {request.customer.name}
                    </p>


                  </div>







                  <div className="mt-6">

                    <RequestActions
                      requestId={request.id}
                    />

                  </div>




                </div>


              ))
            }



          </div>



        )
      }



    </div>

  );

}