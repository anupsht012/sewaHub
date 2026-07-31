import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import EditProviderModal from "@/components/provider/EditProviderModal";
import AddServiceModal from "@/components/provider/AddServiceModal";
import EditServiceModal from "@/components/provider/EditServiceModal";
import DeleteServiceModal from "@/components/provider/DeleteServiceModal";
import ProviderBookings from "@/components/provider/ProviderBookings";

import {
  Briefcase,
  Star,
  CalendarCheck,
  MapPin,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ProviderDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "PROVIDER") {
    redirect("/dashboard");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      services: {
        include: {
          reviews: {
            include: {
              customer: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!provider) {
    redirect("/provider/setup");
  }

  const totalReviews = provider.services.reduce(
    (total, service) => total + service.reviews.length,
    0
  );

  const totalServices = provider.services.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-2 text-gray-500">
            Manage your services and customer requests.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Briefcase />
              </div>
              <div>
                <p className="text-sm text-gray-500">Services</p>
                <h2 className="text-3xl font-bold">{totalServices}</h2>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
                <Star />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reviews</p>
                <h2 className="text-3xl font-bold">{totalReviews}</h2>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CalendarCheck />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <h2 className="text-lg font-bold">
                  {provider.verified ? "Verified" : "Pending"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Profile */}
        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">Provider Profile</h2>
              <p className="mt-2 text-gray-500">
                {provider.bio || "No bio added"}
              </p>
              <div className="mt-4 flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                {provider.location}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {provider.verified ? (
                <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
                  ✅ Verified Provider
                </span>
              ) : (
                <span className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">
                  Pending Verification
                </span>
              )}

              <EditProviderModal provider={provider} />
            </div>
          </div>
        </div>

        {/* My Services (Table View) */}
        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Services</h2>
            <AddServiceModal />
          </div>

          {provider.services.length === 0 ? (
            <p className="mt-6 text-gray-500">No services added yet.</p>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {provider.services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-semibold">
                        {service.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-500">
                        {service.description}
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        Rs. {service.price}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-3">
                          <EditServiceModal service={service}  />
                          <DeleteServiceModal serviceId={service.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Bookings */}
        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold">Booking Requests</h2>
          <div className="mt-6">
            <ProviderBookings />
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold">Customer Reviews ⭐</h2>

          <div className="mt-6 space-y-4">
            {totalReviews === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              provider.services.map((service) =>
                service.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border p-5"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
                        {review.customer.name}
                      </h3>
                      <span className="text-yellow-600">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>

                    <p className="mt-3 text-gray-600">
                      {review.comment || "No comment"}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      Service: {service.name}
                    </p>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}