import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import PersonalInformation from "@/components/profile/PersonalInformation";
import AddressInformation from "@/components/profile/AddressInformation";
import VerificationCard from "@/components/profile/VerificationCard";
import SecurityCard from "@/components/profile/SecurityCard";
import RecentActivity from "@/components/profile/RecentActivity";
import DangerZone from "@/components/profile/DangerZone";



export default async function ProviderProfilePage() {


    const sessionUser = await getCurrentUser();


    if (!sessionUser) {
        redirect("/login");
    }



    const user = await prisma.user.findUnique({

        where: {
            id: sessionUser.id
        },


        include: {

            addresses: true,


            provider: {

                include: {


                    services: {

                        include: {

                            bookings: {

                                include: {

                                    service: true

                                }

                            }

                        }

                    },


                    // reviews: true


                }

            },


            notifications: {

                orderBy: {

                    createdAt: "desc"

                },

                take: 10

            }


        }

    });





    if (!user) {

        redirect("/login");

    }





    const provider = user.provider;



    if (!provider) {

        redirect("/dashboard");

    }






    // Get all bookings from provider services

    const providerBookings = provider.services.flatMap(

        service => service.bookings

    );





    // Completed jobs

    const completedJobs = providerBookings.filter(

        booking =>

            booking.status === "COMPLETED"

    ).length;





    // Total earnings

    const totalEarnings = providerBookings.reduce(

        (total, booking) => {


            if (booking.paymentStatus === "SUCCESS") {

                return total + booking.service.price;

            }


            return total;


        },

        0

    );






    return (

        <div className="space-y-6">





            <ProfileHeader

                user={user}

                role="PROVIDER"

            />







            <ProfileStats

                role="PROVIDER"

                stats={{


                    services:

                        provider.services.length,



                    completedJobs,



                    reviews:

                        0,



                    earnings:

                        totalEarnings


                }}

            />







            <PersonalInformation

                user={user}

            />







            <AddressInformation

                user={user}

            />







            <VerificationCard

                role="PROVIDER"

                user={user}

                providerVerified={

                    provider.verified

                }

            />







            <SecurityCard

                user={user}

            />







            <RecentActivity

                activities={user.notifications}

            />







            <DangerZone

                role="PROVIDER"

            />





        </div>

    );


}