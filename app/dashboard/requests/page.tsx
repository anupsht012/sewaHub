import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import EditRequestModal from "@/components/customer/EditRequestModal";
import CancelRequestModal from "@/components/customer/CancelRequestModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Banknote,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  Inbox,
} from "lucide-react";

export default async function RequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const requests = await prisma.serviceRequest.findMany({
    where: {
      customerId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Helper function for dynamic status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <Clock className="h-3.5 w-3.5" /> OPEN
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> ACCEPTED
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="secondary"
            className="bg-rose-50 text-rose-700 border-rose-200/80 font-bold text-xs gap-1 px-2.5 py-1"
          >
            <XCircle className="h-3.5 w-3.5" /> CANCELLED
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200 font-semibold text-xs gap-1 px-2.5 py-1"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" /> Request History
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Service Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Track, update, or cancel your submitted service requests.
          </p>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-base font-bold text-slate-900">
                No requests yet
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't posted any custom service requests yet. When you request a service, it will show up here.
              </p>
            </Card>
          ) : (
            requests.map((request) => (
              <Card
                key={request.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs transition-all hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    {/* Title & Category */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-extrabold text-slate-900">
                          {request.title}
                        </h2>
                        {request.category && (
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] font-semibold gap-1"
                          >
                            <Tag className="h-3 w-3 text-slate-400" />
                            {request.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {request.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 self-start">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  {/* Information Details Grid */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600 font-medium">
                    {request.location && (
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{request.location}</span>
                      </div>
                    )}

                    {request.phone && (
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{request.phone}</span>
                      </div>
                    )}

                    {request.budget !== null && request.budget !== undefined && (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50/60 p-2.5 border border-emerald-100/60 text-emerald-800">
                        <Banknote className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-bold">
                          NPR {request.budget.toLocaleString("ne-NP")}
                        </span>
                      </div>
                    )}

                    {request.preferredDate && (
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>
                          {new Date(request.preferredDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <EditRequestModal request={request} />
                    <CancelRequestModal requestId={request.id} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}