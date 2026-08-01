import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookServiceModal from "@/components/shared/BookServiceModal";
import { getCurrentUser } from "@/lib/auth/get-user";
import Link from "next/link";
import LoginToBookButton from "@/components/shared/LogintoBookBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  MessageSquareText,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      reviews: {
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      provider: {
        include: {
          user: true,
          services: true,
        },
      },
    },
  });

  if (!service) {
    notFound();
  }

  // Check if current user is a provider
  const isProvider = !!(user as any)?.provider || (user as any)?.role === "PROVIDER";

  const relatedServices = service.provider.services.filter(
    (s) => s.id !== service.id
  );

  const averageRating =
    service.reviews.length > 0
      ? (
          service.reviews.reduce((sum, review) => sum + review.rating, 0) /
          service.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* HEADER NAVIGATION BAR */}
      <div className="border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Services
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* LEFT COLUMN: Main Details & Reviews */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Service Header Info Card */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs">
                      <Sparkles className="h-3 w-3 mr-1" /> Service Details
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
                    {service.name}
                  </h1>
                </div>

                <div className="shrink-0">
                  <div className="inline-flex flex-col items-start sm:items-end rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Standard Rate
                    </span>
                    <span className="text-xl font-black">
                      Rs. {service.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating Stats Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                {averageRating ? (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <div className="flex items-center gap-1 text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/60 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{averageRating}</span>
                    </div>
                    <span className="text-slate-500 font-medium text-xs">
                      based on {service.reviews.length} customer review{service.reviews.length > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Star className="h-4 w-4 text-slate-300" />
                    <span>No customer reviews yet</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Service Description
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
                  {service.description || "No description provided for this service."}
                </p>
              </div>
            </Card>

            {/* CUSTOMER REVIEWS SECTION */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Customer Feedback
                  </h2>
                </div>
                <Badge variant="outline" className="rounded-md border-slate-200 text-slate-600 text-xs font-semibold">
                  {service.reviews.length} Total
                </Badge>
              </div>

              {service.reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                  <Star className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-600">No reviews available yet</p>
                  <p className="text-xs text-slate-400 mt-1">Book this service and be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {service.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-slate-200">
                            <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                              {review.customer.name?.[0]?.toUpperCase() || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {review.customer.name}
                            </p>
                            <span className="text-[10px] text-slate-400">Verified Customer</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 rounded-md bg-amber-50 px-2 py-0.5 border border-amber-200/60">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200 fill-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-slate-600">
                        {review.comment || "No written review provided."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>

          {/* RIGHT COLUMN: Provider Card & Booking Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <CardHeader className="p-0 mb-5">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>Service Provider</span>
                    {service.provider.verified ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-[11px] hover:bg-emerald-50">
                        <BadgeCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-semibold text-[11px]">
                        Pending Verification
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 space-y-6">
                  {/* Provider Info */}
                  <div className="flex items-center gap-3.5">
                    <Avatar className="h-12 w-12 border border-slate-200 ring-2 ring-slate-50 shrink-0">
                      <AvatarImage src={service.provider.user.image || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-base">
                        {service.provider.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="overflow-hidden">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {service.provider.user.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{service.provider.location || "Nepal"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <div className="flex items-center text-xs text-slate-600 gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Guaranteed quality service provider</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-600 gap-2">
                      <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Fast response & flexible booking</span>
                    </div>
                  </div>

                  {/* Booking Action */}
                  <div className="border-t border-slate-100 pt-5">
                    {user ? (
                      isProvider ? (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5 text-amber-800">
                          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                          <p className="text-xs font-medium leading-relaxed">
                            Provider accounts cannot book services.
                          </p>
                        </div>
                      ) : (
                        <BookServiceModal
                          serviceId={service.id}
                          serviceName={service.name}
                        />
                      )
                    ) : (
                      <LoginToBookButton />
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>

        {/* RELATED SERVICES FROM SAME PROVIDER */}
        {relatedServices.length > 0 && (
          <div className="mt-14 border-t border-slate-200/80 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                More Services from {service.provider.user.name}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/services/${item.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="shrink-0 text-xs font-bold text-blue-600">
                        Rs. {item.price}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}