import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import RequestServiceForm from "@/components/customer/RequestServiceForm";
import { Sparkles, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function RequestServicePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CUSTOMER") {
    redirect("/");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Main Card Wrapper */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs transition-all hover:shadow-md">
          {/* Header Section */}
          <div className="mb-8 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs px-2.5 py-1"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1 text-blue-600" />
                Service Request
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Request a Service
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Tell us what service you need and available providers will respond with quotes.
                </p>
              </div>
            </div>
          </div>

          {/* Service Request Form */}
          <RequestServiceForm />
        </div>
      </div>
    </div>
  );
}