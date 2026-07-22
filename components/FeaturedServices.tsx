import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";


export default async function FeaturedServices() {


    const services = await prisma.service.findMany({

        take: 6,

        include: {

            provider: {

                include: {
                    user: true,
                },

            },

            reviews: true,

        },

        orderBy: {

            createdAt: "desc",

        },

    });





    return (

        <section className="bg-white py-20">


            <div className="container mx-auto px-6">



                <div className="mb-12 text-center">


                    <h2 className="text-4xl font-bold">

                        Featured Services

                    </h2>



                    <p className="mt-3 text-gray-500">

                        Explore trusted services from verified professionals.

                    </p>


                </div>






                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">



                    {services.map((service) => {



                        const averageRating =

                            service.reviews.length > 0

                                ? (

                                    service.reviews.reduce(

                                        (sum, review) =>

                                            sum + review.rating,

                                        0

                                    )

                                    /

                                    service.reviews.length

                                ).toFixed(1)

                                : null;





                        return (



                            <div

                                key={service.id}

                                className="rounded-3xl border bg-gray-50 p-6 transition hover:-translate-y-2 hover:shadow-xl"

                            >





                                <div className="flex justify-between gap-4">


                                    <h3 className="text-xl font-bold">

                                        {service.name}

                                    </h3>



                                    <span className="h-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">

                                        Rs. {service.price}

                                    </span>



                                </div>








                                <p className="mt-4 line-clamp-3 text-gray-600">

                                    {service.description ||
                                        "Professional service provided by trusted experts."}

                                </p>







                                <div className="mt-6 space-y-2 text-sm">


                                    <p>

                                        👤 {service.provider.user.name}

                                    </p>



                                    <p>

                                        📍 {service.provider.location}

                                    </p>



                                </div>








                                {averageRating ? (

                                    <div className="mt-4 flex items-center gap-2 text-yellow-600">


                                        <Star className="h-4 w-4 fill-yellow-500" />


                                        <span>

                                            {averageRating}

                                            {" "}

                                            ({service.reviews.length})

                                        </span>


                                    </div>


                                ) : (


                                    <p className="mt-4 text-sm text-gray-400">

                                        No reviews yet

                                    </p>


                                )}









                                <Link href={`/services/${service.id}`}>


                                    <Button className="mt-6 w-full">


                                        View Service


                                    </Button>


                                </Link>







                            </div>


                        );



                    })}




                </div>



            </div>



        </section>


    );

}