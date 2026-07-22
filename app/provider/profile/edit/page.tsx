import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import ProviderEditForm from "@/components/ProviderEditForm";


export default async function EditProviderPage(){

  const user = await getCurrentUser();


  if(!user){
    redirect("/login");
  }


  const provider = await prisma.provider.findUnique({
    where:{
      userId:user.id,
    },
  });


  if(!provider){
    redirect("/provider/setup");
  }


  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow">

        <h1 className="text-3xl font-bold">
          Edit Provider Profile
        </h1>


        <ProviderEditForm
          provider={provider}
        />

      </div>

    </div>

  );
}