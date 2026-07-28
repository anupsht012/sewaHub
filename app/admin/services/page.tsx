import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import { Button } from "@/components/ui/button";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <p className="mt-2 text-gray-500">
          Review, inspect and remove services.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow">
          No services found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                  <TableRow key={service.id}>
                    <TableCell className="font-bold">
                      {service.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {service.provider.user.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {service.category}
                    </TableCell>
                    <TableCell className="font-medium">
                      Rs. {service.price}
                    </TableCell>
                    <TableCell>⭐ {averageRating}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/services/${service.id}`}>
                          <Button>View</Button>
                        </Link>
                        <DeleteServiceButton serviceId={service.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}