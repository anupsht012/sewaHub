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


export default async function AdminProfilePage() {


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





    return (

        <div className="space-y-6">


            <ProfileHeader

                user={user}

                role="ADMIN"

            />



            <ProfileStats

                role="ADMIN"

                stats={{

                    users: await prisma.user.count(),

                    providers: await prisma.provider.count(),

                    notifications: user.notifications.length

                }}

            />



            <PersonalInformation

                user={user}

            />



            <AddressInformation

                user={user}

            />



            <VerificationCard

                role="ADMIN"

                user={user}

            />



            <SecurityCard

                user={user}

            />



            <RecentActivity

                activities={user.notifications}

            />



            <DangerZone

                role="ADMIN"

            />


        </div>

    );

}