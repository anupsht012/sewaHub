import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import { Button } from "@/components/ui/button";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";

interface AdminServiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminServiceDetailPage({
  params,
}: AdminServiceDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      provider: {
        include: {
          user: {
            include: {
              address: true,
            },
          },
        },
      },
      reviews: {
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!service) {
    notFound();
  }

  const totalReviews = service.reviews.length;
  const averageRating =
    totalReviews === 0
      ? "0.0"
      : (
          service.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/services"
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-3 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {service.name}
              </h1>
              <Badge
                variant="outline"
                className="border-slate-200 bg-slate-50 capitalize text-slate-700"
              >
                <Briefcase className="mr-1 h-3 w-3 text-slate-500" />
                {service.category}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">Service ID: {service.id}</p>
          </div>

          <div className="flex items-center gap-3">
            <DeleteServiceButton serviceId={service.id} />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-100 bg-white shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Price
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Rs. {service.price.toLocaleString()}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rating
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {averageRating}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    ({totalReviews} reviews)
                  </span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Listed Date
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  {new Date(service.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details & Provider Section */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Description */}
          <Card className="md:col-span-2 border-slate-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {service.description || "No description provided for this service."}
              </p>
            </CardContent>
          </Card>

          {/* Provider Card */}
          <Card className="border-slate-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Provider Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                  {service.provider.user.name?.[0]?.toUpperCase() || "P"}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {service.provider.user.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Provider ID: {service.provider.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{service.provider.user.email}</span>
                </div>
                {service.provider.user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{service.provider.user.phone}</span>
                  </div>
                )}
                {service.provider.user.address?.label && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{service.provider.user.address.label}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Reviews List */}
        <Card className="border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              Customer Reviews ({totalReviews})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {service.reviews.length === 0 ? (
              <p className="py-6 text-center text-sm font-medium text-slate-500">
                No reviews submitted for this service yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {service.reviews.map((review) => {
                  const customerName =
                    review.customer?.name || "Anonymous Customer";

                  return (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-900">
                            {customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-amber-600 text-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{review.rating}.0</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm text-slate-600">
                          {review.comment}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}