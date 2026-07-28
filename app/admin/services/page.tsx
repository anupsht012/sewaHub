import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import { Button } from "@/components/ui/button";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";

export default async function AdminServicesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const services = await prisma.service.findMany({
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
    <div className="mx-auto max-w-7xl">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Manage Services
        </h1>

        <p className="mt-2 text-gray-500">
          Review, inspect and remove services.
        </p>

      </div>

      {services.length === 0 ? (

        <div className="rounded-2xl bg-white p-8 shadow">
          No services found.
        </div>

      ) : (

        <div className="space-y-5">

          {services?.map((service) => {

            const averageRating =
              service.reviews.length === 0
                ? 0
                : (
                    service.reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / service.reviews.length
                  ).toFixed(1);

            return (

              <div
                key={service.id}
                className="rounded-2xl bg-white p-6 shadow"
              >

                <div className="flex items-center justify-between">

                  <div className="space-y-2">

                    <h2 className="text-xl font-bold">
                      {service.name}
                    </h2>

                    <p className="text-gray-500">
                      {service.provider.user.name}
                    </p>

                    <p>
                      Category: {service.category}
                    </p>

                    <p>
                      Price: Rs. {service.price}
                    </p>

                    <p>
                      ⭐ {averageRating}
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <Link href={`/admin/services/${service.id}`}>
                      <Button>
                        View
                      </Button>
                    </Link>

                    <DeleteServiceButton
                      serviceId={service.id}
                    />

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}