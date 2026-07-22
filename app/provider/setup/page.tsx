import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import ProviderSetupForm from "@/components/ProviderSetupForm";

export default async function ProviderSetupPage() {

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }


  if (user.role !== "PROVIDER") {
    redirect("/dashboard");
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow">

        <h1 className="text-3xl font-bold">
          Complete Provider Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Tell customers about your service.
        </p>


        <div className="mt-8">
          <ProviderSetupForm />
        </div>

      </div>

    </div>
  );
}