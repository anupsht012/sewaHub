import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import ProviderApplyForm from "@/components/provider/ProviderApplyForm";

export default async function ProviderApplyPage() {

  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role === "PROVIDER") {
    redirect("/provider");
  }


  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow">


        <h1 className="text-3xl font-bold">
          Become a Provider
        </h1>


        <p className="mt-2 text-gray-500">
          Offer your services to customers on SewaHub Nepal.
        </p>



        <div className="mt-8">

          <ProviderApplyForm />

        </div>


      </div>

    </div>

  );
}