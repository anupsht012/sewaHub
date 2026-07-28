import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";



export default async function ProviderBookingsPage() {


    const user = await getCurrentUser();


    if (!user) {
        redirect("/login");
    }


    if (user.role !== "PROVIDER") {
        redirect("/");
    }



    const provider = await prisma.provider.findUnique({

        where: {
            userId: user.id,
        },

    });



    if (!provider) {

        return (

            <div className="rounded-2xl bg-white p-8 shadow">

                <h2 className="text-xl font-bold">
                    Provider profile not found
                </h2>

            </div>

        );

    }





    const bookings = await prisma.booking.findMany({

        where: {

            service: {

                providerId: provider.id,

            },

        },


        include: {

            customer: {

                select: {

                    name: true,
                    email: true,
                    image: true,

                },

            },


            service: {

                select: {

                    name: true,
                    price: true,

                },

            },

        },


        orderBy: {

            createdAt: "desc",

        },

    });







    return (

        <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">



            <div>


                <h1 className="text-3xl font-bold">
                    My Bookings
                </h1>


                <p className="mt-2 text-gray-500">
                    Manage bookings received from customers.
                </p>


            </div>





            {
                bookings.length === 0 ? (


                    <div
                        className="
                            rounded-2xl
                            bg-white
                            p-8
                            text-center
                            shadow
                        "
                    >

                        <h2 className="text-xl font-semibold">
                            No bookings yet
                        </h2>


                        <p className="mt-2 text-gray-500">
                            Customer bookings will appear here.
                        </p>


                    </div>



                ) : (



                    <div className="grid gap-5 md:grid-cols-2">



                        {
                            bookings.map((booking)=>(


                                <div
                                    key={booking.id}
                                    className="
                                        rounded-2xl
                                        bg-white
                                        p-6
                                        shadow-sm
                                    "
                                >



                                    <h2 className="text-xl font-bold">

                                        {booking.service.name}

                                    </h2>




                                    <div className="mt-4 space-y-2 text-sm text-gray-600">


                                        <p>
                                            Customer:
                                            {" "}
                                            {booking.customer.name}
                                        </p>



                                        <p>
                                            Email:
                                            {" "}
                                            {booking.customer.email}
                                        </p>




                                        <p>
                                            Price:
                                            {" "}
                                            Rs. {booking.service.price}
                                        </p>




                                        <p>
                                            Booking Date:
                                            {" "}
                                            {new Date(
                                                booking.bookingDate
                                            ).toLocaleDateString()}
                                        </p>




                                        <p>
                                            Phone:
                                            {" "}
                                            {booking.phone}
                                        </p>




                                        <p>
                                            Address:
                                            {" "}
                                            {booking.address}
                                        </p>




                                        {
                                            booking.note && (

                                                <p>
                                                    Note:
                                                    {" "}
                                                    {booking.note}
                                                </p>

                                            )
                                        }



                                    </div>





                                    <div className="mt-5">


                                        <span
                                            className={`
                                                rounded-full
                                                px-3
                                                py-1
                                                text-sm

                                                ${
                                                    booking.status === "ACCEPTED"
                                                    ? "bg-green-100 text-green-700"
                                                    :
                                                    booking.status === "REJECTED"
                                                    ? "bg-red-100 text-red-700"
                                                    :
                                                    "bg-yellow-100 text-yellow-700"
                                                }
                                            `}
                                        >

                                            {booking.status}

                                        </span>


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