import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import UnverifyProviderButton from "@/components/admin/UnverifyProviderButton";
import VerifyProviderButton from "@/components/admin/VerifyProviderButton";

import { Button } from "@/components/ui/button";


export default async function ProvidersPage() {


    const user = await getCurrentUser();


    if (!user) {
        redirect("/login");
    }


    if (user.role !== "ADMIN") {
        redirect("/");
    }



    const providers = await prisma.provider.findMany({

        where: {

            user: {
                role: "PROVIDER",
            },

        },


        include: {

            user: true,

            services: true,

        },


        orderBy: {

            createdAt: "desc",

        },

    });





    return (

        <div className="mx-auto max-w-7xl p-6 md:p-8">


            <div className="mb-8">


                <h1 className="text-3xl font-bold">
                    Manage Providers
                </h1>


                <p className="mt-2 text-gray-500">
                    Verify or manage all registered providers.
                </p>


            </div>





            {providers.length === 0 ? (


                <div className="rounded-2xl bg-white p-8 shadow">

                    <h2 className="font-semibold">
                        No providers found.
                    </h2>

                </div>



            ) : (


                <div className="space-y-6">


                    {providers.map((provider)=>(


                        <div
                            key={provider.id}
                            className="
                                rounded-2xl
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >


                            <div
                                className="
                                    flex
                                    flex-col
                                    justify-between
                                    gap-5
                                    md:flex-row
                                    md:items-center
                                "
                            >



                                <div>


                                    <h2 className="text-xl font-bold">

                                        {provider.user.name}

                                    </h2>



                                    <p className="text-gray-500">

                                        {provider.user.email}

                                    </p>




                                    <p className="mt-2 text-gray-600">

                                        📍 {provider.location}

                                    </p>




                                    <p className="text-gray-600">

                                        Services:
                                        {" "}
                                        {provider.services.length}

                                    </p>





                                    <div className="mt-3">


                                        {provider.verified ? (


                                            <span
                                                className="
                                                    rounded-full
                                                    bg-green-100
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    text-green-700
                                                "
                                            >
                                                Verified
                                            </span>


                                        ) : (


                                            <span
                                                className="
                                                    rounded-full
                                                    bg-yellow-100
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    text-yellow-700
                                                "
                                            >
                                                Not Verified
                                            </span>


                                        )}


                                    </div>



                                </div>





                                <div
                                    className="
                                        flex
                                        gap-3
                                    "
                                >



                                    {provider.verified ? (


                                        <UnverifyProviderButton
                                            providerId={provider.id}
                                        />


                                    ) : (


                                        <VerifyProviderButton
                                            providerId={provider.id}
                                        />


                                    )}




                                    <Link
                                        href={`/admin/providers/${provider.id}`}
                                    >

                                        <Button
                                            className="
                                                cursor-pointer
                                                bg-black
                                                hover:bg-amber-950
                                            "
                                        >

                                            View

                                        </Button>


                                    </Link>



                                </div>



                            </div>


                        </div>



                    ))}


                </div>


            )}


        </div>

    );
}