import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import AddServiceModal from "@/components/provider/AddServiceModal";
import DeleteServiceModal from "@/components/provider/DeleteServiceModal";
import EditServiceModal from "@/components/provider/EditServiceModal";

import {
  Package,
  CalendarCheck,
  Star,
  Clock,
  Sparkles,
  AlertCircle,
  Tag,
  Banknote,
} from "lucide-react";

export default async function ProviderServicesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "PROVIDER") {
    redirect("/");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mx-auto mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Provider Profile Not Found
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Please complete your provider setup to manage your services.
          </p>
        </Card>
      </div>
    );
  }

  const services = await prisma.service.findMany({
    where: {
      providerId: provider.id,
    },
    include: {
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> Service Catalog
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Services
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage your services, track bookings, and update pricing offerings.
            </p>
          </div>

          <AddServiceModal />
        </div>

        {/* SERVICES GRID OR EMPTY STATE */}
        {services.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
              <Package className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No Services Created
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Create your first service offering to start accepting customer bookings.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services?.map((service) => (
              <Card
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Top Decorative Bar */}
                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 w-full" />

                <div>
                  <CardHeader className="p-5 pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-semibold gap-1">
                          <Tag className="h-3 w-3 text-slate-500" />
                          {service.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <Clock className="h-3 w-3" />
                          {new Date(service.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">
                        {service.name}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-5 space-y-5">
                    <p className="line-clamp-3 min-h-[60px] text-xs sm:text-sm leading-relaxed text-slate-600">
                      {service.description || "No description provided for this service."}
                    </p>

                    {/* STATS & PRICING */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Banknote className="h-3 w-3" /> Price
                        </p>
                        <p className="mt-1 text-base font-extrabold text-blue-600">
                          NPR {service.price}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" /> Bookings
                        </p>
                        <p className="mt-1 text-base font-extrabold text-slate-900">
                          {service._count.bookings}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* ACTIONS */}
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center gap-3">
                  <EditServiceModal service={service} />
                  <DeleteServiceModal serviceId={service.id} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}