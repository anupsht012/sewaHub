import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import EditProviderModal from "@/components/provider/EditProviderModal";
import AddServiceModal from "@/components/provider/AddServiceModal";
import EditServiceModal from "@/components/provider/EditServiceModal";
import DeleteServiceModal from "@/components/provider/DeleteServiceModal";
import ProviderBookings from "@/components/provider/ProviderBookings";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Briefcase,
  Star,
  CalendarCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  BadgeCheck,
  User,
  Sparkles,
  MessageSquare,
  Package,
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
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> Provider Portal
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your services, track bookings, and respond to customer reviews.
            </p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all hover:shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Services</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{totalServices}</h2>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all hover:shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reviews</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{totalReviews}</h2>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all hover:shadow-xs sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</p>
                <div className="mt-1">
                  {provider.verified ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-semibold text-xs gap-1 px-2.5 py-0.5">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-semibold text-xs gap-1 px-2.5 py-0.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* PROVIDER PROFILE CARD */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border border-slate-200 ring-2 ring-slate-50 shrink-0">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{user.name}</h2>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{provider.location || "Location not set"}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 max-w-2xl">
                {provider.bio || "No biography added yet. Update your profile to tell customers about your expertise."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              {provider.verified ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> Verified Provider
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" /> Pending Verification
                </div>
              )}

              <EditProviderModal provider={provider} />
            </div>
          </div>
        </Card>

        {/* MY SERVICES TABLE SECTION */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" /> My Services
            </CardTitle>
            <AddServiceModal providerCategory={provider.category ?? undefined } />
          </CardHeader>
          <CardContent className="p-0">
            {provider.services.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No services added yet.</p>
                <p className="text-xs text-slate-400 mt-1">Click the button above to add your first service offering.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="font-semibold text-slate-700 text-xs">Service</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Description</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Category</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-xs">Price</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.services.map((service) => (
                      <TableRow key={service.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <TableCell className="font-bold text-slate-900 text-xs sm:text-sm">
                          {service.name}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-slate-600">
                          {service.description || "No description"}
                        </TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-slate-600">
                          {service.category || "No category"}
                        </TableCell>
                        <TableCell className="font-extrabold text-blue-600 text-xs sm:text-sm">
                          Rs. {service.price}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <EditServiceModal service={service} />
                            <DeleteServiceModal serviceId={service.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BOOKING REQUESTS SECTION */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <CardHeader className="p-0 mb-6 pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-blue-600" /> Booking Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ProviderBookings />
          </CardContent>
        </Card>

        {/* CUSTOMER REVIEWS SECTION */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <CardHeader className="p-0 mb-6 pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" /> Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {totalReviews === 0 ? (
              <div className="py-8 text-center">
                <Star className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No reviews yet.</p>
                <p className="text-xs text-slate-400 mt-1">Customer ratings and comments will show up here once services are completed.</p>
              </div>
            ) : (
              provider.services.map((service) =>
                service.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5 transition-all hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200 shrink-0">
                          <AvatarImage src={review.customer.image || ""} />
                          <AvatarFallback className="bg-slate-200 text-slate-700 text-xs font-bold">
                            {review.customer.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">
                            {review.customer.name}
                          </h3>
                          <Badge variant="outline" className="mt-0.5 rounded-md bg-white text-[10px] font-medium text-slate-500 border-slate-200">
                            Service: {service.name}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-700">{review.rating}.0</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700 italic">
                      "{review.comment || "No written comment provided."}"
                    </p>
                  </div>
                ))
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}