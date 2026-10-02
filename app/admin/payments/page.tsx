import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentActions } from "@/components/admin/PaymentActions";
import { PaymentFilterControls } from "@/components/admin/PaymentFilterControls";

const PAGE_SIZE = 10;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const resolvedParams = await searchParams;
  const query = resolvedParams.query?.trim() || "";
  const status = resolvedParams.status || "ALL";
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));

  const whereCondition: any = {};
  if (status && status !== "ALL") {
    whereCondition.status = status;
  }
  
  if (query.length > 0) {
    whereCondition.OR = [
      { transactionUuid: { contains: query, mode: "insensitive" } },
      {
        booking: {
          is: {
            customer: {
              is: {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { email: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
        },
      },
    ];
  }

  const [payments, totalCount] = await Promise.all([
    prisma.payment.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        booking: {
          include: {
            customer: { select: { name: true, email: true } },
            service: {
              select: {
                name: true,
                provider: { select: { user: { select: { name: true } } } },
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where: whereCondition }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const getStatusBadge = (s: string) => {
    if (s === "SUCCESS") return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="mr-1 h-3 w-3" />Success</Badge>;
    if (s === "PENDING") return <Badge className="bg-amber-50 text-amber-700 border border-amber-200"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    if (s === "FAILED") return <Badge className="bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>;
    return <Badge variant="outline">{s}</Badge>;
  };

  return (
    <div className=" w-full bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Main Content Card with Table and Filters */}
        <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-4 sm:p-6 border-b border-slate-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-semibold">Payment Transactions ({totalCount})</CardTitle>
              
              {/* Instant Filter Controls Component */}
              <PaymentFilterControls initialQuery={query} initialStatus={status} />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Mobile View: Cards */}
            <div className="grid gap-3 p-4 sm:hidden">
              {payments.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">No payments found</p>
              ) : (
                payments.map((p: any) => (
                  <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-600 truncate max-w-[150px]">
                        {p.transactionUuid?.slice(0, 15) || p.id.slice(0, 15)}
                      </span>
                      {getStatusBadge(p.status)}
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium text-slate-900">
                        <span className="truncate">{p.booking?.customer?.name}</span>
                        <span className="font-bold">Rs. {p.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-slate-500 truncate">{p.booking?.service?.name || "N/A"} • <span className="uppercase">{p.method}</span></p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {p.proofImageUrl ? (
                        <a href={p.proofImageUrl} target="_blank" rel="noreferrer">
                          <img src={p.proofImageUrl} className="h-10 w-10 rounded-lg border object-cover" alt="payment proof" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No proof</span>
                      )}
                      
                      {p.status === "PENDING" ? (
                        <PaymentActions paymentId={p.id} />
                      ) : (
                        <span className="text-xs font-medium text-slate-400">Processed</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Txn / Method</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Service / Provider</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Proof</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs font-medium text-slate-700">
                            {p.transactionUuid ? p.transactionUuid.slice(0, 12) + "..." : p.id.slice(0, 10) + "..."}
                          </p>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400">{p.method}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-xs text-slate-900 truncate max-w-[160px]">{p.booking?.customer?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{p.booking?.customer?.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-slate-900 truncate max-w-[160px]">{p.booking?.service?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{p.booking?.service?.provider?.user?.name}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-xs text-slate-900">
                          Rs. {p.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          {p.proofImageUrl ? (
                            <a href={p.proofImageUrl} target="_blank" rel="noreferrer">
                              <img src={p.proofImageUrl} className="h-10 w-10 rounded-lg border border-slate-200 object-cover hover:scale-110 transition-transform shadow-xs" alt="proof" />
                            </a>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.status === "PENDING" ? (
                            <div className="inline-block">
                              <PaymentActions paymentId={p.id} />
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">Done</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
                <p className="text-xs text-slate-500">
                  Page <span className="font-medium text-slate-700">{currentPage}</span> of <span className="font-medium text-slate-700">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`?status=${status}&query=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                      scroll={false}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <ChevronLeft className="h-3 w-3" /> Prev
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`?status=${status}&query=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                      scroll={false}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Next <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}