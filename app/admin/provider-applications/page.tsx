import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import ApproveProviderButton from "@/components/admin/ApproveProviderButton";
import RejectProviderButton from "@/components/admin/RejectProviderButton";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Sparkles,
  Clock,
  User,
  Mail,
  MapPin,
  Phone,
  Tag,
  CheckCircle2,
} from "lucide-react";

export default async function ProviderApplicationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const applications = await prisma.providerApplication.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Applications Queue
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-600">
                {applications.length} Pending Requests
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Provider Applications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review and manage new provider application requests for KaamSewa.
            </p>
          </div>
        </div>

        {/* Applications List or Empty State */}
        {applications.length === 0 ? (
          <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                No pending applications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All provider applications have been handled and reviewed.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card
                key={application.id}
                className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all hover:shadow-lg"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Title & Status */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">
                          {application.businessName}
                        </h2>
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50/50 text-amber-700 font-medium"
                        >
                          <Clock className="mr-1 h-3 w-3 text-amber-600" />
                          Pending Review
                        </Badge>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 pt-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>
                            <strong className="text-slate-800">Applicant:</strong>{" "}
                            {application.user.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>
                            <strong className="text-slate-800">Email:</strong>{" "}
                            {application.user.email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>
                            <strong className="text-slate-800">Category:</strong>{" "}
                            {application.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>
                            <strong className="text-slate-800">Location:</strong>{" "}
                            {application.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>
                            <strong className="text-slate-800">Phone:</strong>{" "}
                            {application.phone}
                          </span>
                        </div>
                      </div>

                      {/* Application Description */}
                      {application.description && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 mt-3">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Application Statement
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {application.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <ApproveProviderButton applicationId={application.id} />
                      <RejectProviderButton applicationId={application.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}