import { redirect } from "next/navigation";
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
  Clock,
  Sparkles,
  AlertCircle,
  Tag,
  Banknote,
} from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic"; // don't cache provider page

export default async function ProviderServicesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role!== "PROVIDER") redirect("/");

  // 1 query only — get provider with services in one go = fastest
  const provider = await prisma.provider.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      services: {
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          price: true,
          image: true,
          createdAt: true,
          _count: { select: { bookings: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-2xl p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mx-auto mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold">Provider Profile Not Found</h2>
          <p className="mt-2 text-sm text-slate-500">Please complete your provider setup.</p>
        </Card>
      </div>
    );
  }

  const services = provider.services;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs mb-1">
              <Sparkles className="h-3 w-3 mr-1" /> Service Catalog
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Services</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your services and update pricing.</p>
          </div>
          <AddServiceModal />
        </div>

        {services.length === 0? (
          <Card className="rounded-2xl p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
              <Package className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold">No Services Created</h2>
            <p className="mt-1 text-sm text-slate-500">Create your first service to start accepting bookings.</p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 w-full" />

                {/* IMAGE */}
                {service.image? (
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Package className="h-10 w-10 text-slate-300" />
                  </div>
                )}

                <div>
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text- font-semibold gap-1">
                        <Tag className="h-3 w-3" /> {service.category}
                      </Badge>
                      <div className="flex items-center gap-1 text- text-slate-400">
                        <Clock className="h-3 w-3" />
                        {new Date(service.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold line-clamp-1">{service.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="px-5 pb-5 space-y-5">
                    <p className="line-clamp-3 min-h- text-sm leading-relaxed text-slate-600">
                      {service.description || "No description provided."}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border bg-slate-50/80 p-3">
                        <p className="text- font-semibold uppercase text-slate-400 flex items-center gap-1">
                          <Banknote className="h-3 w-3" /> Price
                        </p>
                        <p className="mt-1 text-base font-extrabold text-blue-600">NPR {service.price}</p>
                      </div>
                      <div className="rounded-xl border bg-slate-50/80 p-3">
                        <p className="text- font-semibold uppercase text-slate-400 flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" /> Bookings
                        </p>
                        <p className="mt-1 text-base font-extrabold">{service._count.bookings}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="px-5 py-4 border-t bg-slate-50/30 flex items-center gap-3">
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