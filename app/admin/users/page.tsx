import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import DeleteUserButton from "@/components/admin/DeleteUserButton";



export default async function AdminUsersPage() {

  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  if (user.role !== "ADMIN") {
    redirect("/");
  }



  const users = await prisma.user.findMany({

    orderBy:{
      createdAt:"desc",
    },

    include:{
      provider:true,
    },

  });



  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="mx-auto max-w-6xl">


        <h1 className="text-3xl font-bold">
          Manage Users
        </h1>


        <p className="mt-2 text-gray-500">
          View and manage all SewaHub accounts.
        </p>



        <div className="mt-8 rounded-3xl bg-white shadow overflow-hidden">


          <table className="w-full">


            <thead className="border-b bg-gray-50">

              <tr>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Provider
                </th>

                <th className="p-4">
                  Action
                </th>

              </tr>

            </thead>



            <tbody>


              {users.map((item)=>(


                <tr
                  key={item.id}
                  className="border-b"
                >


                  <td className="p-4">
                    {item.name}
                  </td>


                  <td className="p-4 text-gray-600">
                    {item.email}
                  </td>



                  <td className="p-4">

                    <span className="
                      rounded-full
                      bg-blue-100
                      px-3
                      py-1
                      text-sm
                      text-blue-700
                    ">
                      {item.role}
                    </span>

                  </td>



                  <td className="p-4">

                    {
                      item.provider
                      ?
                      "Yes"
                      :
                      "No"
                    }

                  </td>



                  <td className="p-4">


                    {
                      item.role !== "ADMIN" && (

                        <DeleteUserButton
                          userId={item.id}
                        />

                      )
                    }


                  </td>



                </tr>


              ))}


            </tbody>


          </table>


        </div>


      </div>


    </div>

  );
}