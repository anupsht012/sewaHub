import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-user";

import RequestServiceForm from "@/components/customer/RequestServiceForm";



export default async function RequestServicePage() {



  const user = await getCurrentUser();



  if (!user) {

    redirect("/login");

  }



  if (user.role !== "CUSTOMER") {

    redirect("/");

  }





  return (


    <div

      className="
        min-h-[calc(100vh-4rem)]
        flex
        items-center
        justify-center
        p-6
      "

    >



      <div

        className="
          w-full
          max-w-3xl
          rounded-3xl
          bg-white
          p-8
          shadow-lg
        "

      >




        <div className="mb-8">



          <h1

            className="
              text-3xl
              font-bold
              text-gray-900
            "

          >

            Request a Service 🛠️


          </h1>




          <p

            className="
              mt-2
              text-gray-500
            "

          >

            Tell us what service you need and providers will respond.


          </p>




        </div>





        <RequestServiceForm />




      </div>




    </div>


  );


}