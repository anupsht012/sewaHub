import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import RequestActions from "@/components/provider/RequestActions";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  MapPin,
  Tag,
  Banknote,
  User,
  Inbox,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";

export default async function ProviderRequestsPage() {
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
            Please complete your provider setup to start receiving service requests.
          </p>
        </Card>
      </div>
    );
  }

  const requests = await prisma.serviceRequest.findMany({
    where: {
      status: "OPEN",
      providerId: null,
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs">
              <Sparkles className="h-3 w-3 mr-1" /> Marketplace
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Service Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Browse available jobs from nearby customers and offer your services.
          </p>
        </div>

        {/* REQUESTS LIST */}
        {requests.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
              <Inbox className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No Requests Available
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              There are currently no open service requests. Check back later for new customer listings.
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-2xs transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* HEADER & CATEGORY BADGE */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-semibold gap-1">
                        <Tag className="h-3 w-3 text-slate-500" />
                        {request.category}
                      </Badge>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px] font-bold">
                        OPEN
                      </Badge>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 line-clamp-1">
                      {request.title}
                    </h2>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {request.description || "No specific details provided for this request."}
                  </p>

                  {/* DETAILS LIST */}
                  <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Banknote className="h-3.5 w-3.5 text-slate-400" /> Budget
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {request.budget ? `Rs. ${request.budget}` : "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px] text-right">
                        {request.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" /> Customer
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5 border border-slate-200 shrink-0">
                          <AvatarImage src={request.customer.image || ""} />
                          <AvatarFallback className="bg-slate-200 text-slate-700 text-[9px] font-bold">
                            {request.customer.name?.charAt(0).toUpperCase() || <User className="h-3 w-3" />}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                          {request.customer.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="mt-6 pt-2 border-t border-slate-100">
                  <RequestActions requestId={request.id} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}