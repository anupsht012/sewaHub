import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { Card, CardContent } from "@/components/ui/card";

export default async function CustomerRequestsPage() {

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

      include: {
        offers: true,
      },

    });



  return (

    <main className="min-h-screen bg-gray-50 p-6 md:p-10">


      <div className="mx-auto max-w-5xl">


        <h1 className="mb-8 text-4xl font-bold">
          My Service Requests
        </h1>



        {requests.length === 0 ? (

          <Card className="rounded-3xl">

            <CardContent className="p-8 text-center text-gray-500">

              You have not created any service requests yet.

            </CardContent>

          </Card>


        ) : (


          <div className="grid gap-6">


            {requests.map((request) => (

              <Card
                key={request.id}
                className="rounded-3xl shadow-sm"
              >

                <CardContent className="p-6">


                  <div className="flex flex-col justify-between gap-4 md:flex-row">


                    <div>


                      <h2 className="text-2xl font-bold">
                        {request.title}
                      </h2>


                      <p className="mt-2 text-gray-600">
                        {request.description}
                      </p>


                      <div className="mt-4 space-y-1 text-sm text-gray-500">

                        <p>
                          Category: {request.category}
                        </p>

                        <p>
                          Location: {request.location}
                        </p>

                        <p>
                          Phone: {request.phone}
                        </p>


                        {request.budget && (

                          <p>
                            Budget: Rs. {request.budget}
                          </p>

                        )}

                      </div>


                    </div>



                    <div className="flex flex-col items-start gap-2">


                      <span
                        className={
                          request.status === "OPEN"
                          ?
                          "rounded-full bg-green-100 px-4 py-2 text-sm text-green-700"
                          :
                          "rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
                        }
                      >

                        {request.status}

                      </span>



                      <span className="text-sm text-gray-500">

                        Offers:
                        {" "}
                        {request.offers.length}

                      </span>


                    </div>



                  </div>


                </CardContent>


              </Card>


            ))}


          </div>


        )}


      </div>


    </main>

  );
}