import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import VerifyProviderButton from "@/components/admin/VerifyProviderButton";
import UnverifyProviderButton from "@/components/admin/UnverifyProviderButton";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Briefcase,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  User,
} from "lucide-react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminProviderDetailsPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const provider = await prisma.provider.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
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
    notFound();
  }

  const reviews = provider.services.flatMap((service) =>
    service.reviews.map((review) => ({
      ...review,
      serviceName: service.name,
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Link href="/admin/providers">
              <Button
                variant="outline"
                className="cursor-pointer mb-3 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Provider Profile
                </Badge>
                {provider.verified ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50/50 text-emerald-700 font-medium"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50/50 text-amber-700 font-medium"
                  >
                    <XCircle className="mr-1 h-3 w-3 text-amber-600" />
                    Not Verified
                  </Badge>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {provider.user.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {provider.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {provider.verified ? (
              <UnverifyProviderButton providerId={provider.id} />
            ) : (
              <VerifyProviderButton providerId={provider.id} />
            )}
          </div>
        </div>

        {/* Provider Overview Card */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {provider.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Services Offered
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {provider.services.length} Total Services
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Reviews
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {reviews.length} Reviews
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              Services Offered
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {provider.services.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No services registered yet.
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 transition-all hover:border-slate-200 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {service.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shrink-0"
                        >
                          Rs. {service.price}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                        {service.reviews.length} Reviews
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Reviews Section */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {reviews.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No reviews yet for this provider.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-slate-100 bg-white p-5 transition-all hover:border-slate-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {review.customer.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Service: {review.serviceName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-10">
                      {review.comment || (
                        <span className="italic text-slate-400">
                          No written comment provided.
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}