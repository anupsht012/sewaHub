import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import AddServiceForm from "@/components/AddServiceForm";

export default async function NewServicePage() {

  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role !== "PROVIDER") {
    redirect("/dashboard");
  }


  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow">


        <h1 className="text-3xl font-bold">
          Add New Service
        </h1>


        <p className="mt-2 text-gray-500">
          Create a service customers can book.
        </p>


        <div className="mt-8">
          <AddServiceForm />
        </div>


      </div>

    </div>
  );
}