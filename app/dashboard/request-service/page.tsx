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

    <div className="min-h-screen bg-gray-50 p-6 md:p-10">


      <div
        className="
          mx-auto
          max-w-3xl
          rounded-3xl
          bg-white
          p-8
          shadow
        "
      >


        <div className="mb-8">

          <h1 className="text-3xl font-bold">

            Request a Service 🛠️

          </h1>


          <p className="mt-2 text-gray-500">

            Tell us what service you need.

          </p>


        </div>



        <RequestServiceForm />


      </div>


    </div>

  );

}